<?php

namespace Tests\Feature\Ussd;

use Tests\TestCase;
use Illuminate\Http\Request;
use Tests\Support\TestableUssdService;

/**
 * Deterministic proof of the cache-behind-the-cursor mechanism (the on-screen REST
 * replay that keeps deep menus fast). End-to-end byte-identical correctness through
 * deep navigation AND go-backs is covered by the golden-master suite (its deepPath
 * includes several "0" back-steps, all with the cache active); this pins the novel
 * pieces directly:
 *   - a BEHIND screen (already answered) serves its call from cache; the FOCUSED
 *     screen always runs live
 *   - the cache key is the navigation-path prefix, so the same call reached via a
 *     different path never collides
 *   - going back UNSETS the abandoned branch's cache (pruneScreenHttpToCurrentPath)
 */
class ScreenHttpCacheTest extends TestCase
{
    private function service(): TestableUssdService
    {
        $request = Request::create(
            '/api/launch/ussd', 'POST', [], [], [],
            ['CONTENT_TYPE' => 'application/json', 'HTTP_ACCEPT' => 'application/json'], '{}'
        );

        return new TestableUssdService($request);
    }

    /** Invoke a private/protected method. */
    private function invokePrivate(object $svc, string $method, array $args = [])
    {
        $m = new \ReflectionMethod($svc, $method);
        $m->setAccessible(true);

        return $m->invoke($svc, ...$args);
    }

    public function test_focused_screen_runs_live_but_a_behind_screen_serves_from_cache(): void
    {
        $svc = $this->service();
        $svc->onStartHttpActive = false;

        //  Journey so far: responses ['2','1'] (text "2*1") — two screens answered.
        $svc->addReplyRecord('2');
        $svc->addReplyRecord('1');

        $url = 'http://cms/api/topics/105/children';

        //  Cache holds a response captured for the screen reached via prefix "2" (level 2).
        $svc->screenHttpReplay = ['2|get|'.$url => ['body' => '{"cached":true}', 'status' => 200]];

        //  Level 2 HAS a stored response -> behind the cursor -> replay from cache.
        $svc->level = 2;
        $this->assertTrue($svc->isReconstructingScreen(), 'level 2 is behind the cursor');
        $this->assertSame(
            ['body' => '{"cached":true}', 'status' => 200],
            $svc->getScreenHttpReplay('get', $url),
            'a behind screen must replay its call from cache'
        );

        //  Level 3 has NO stored response -> this is the focused screen -> run live (null).
        $svc->level = 3;
        $this->assertFalse($svc->isReconstructingScreen(), 'level 3 is the focused screen');
        $this->assertNull(
            $svc->getScreenHttpReplay('get', $url),
            'the focused screen must run live, never from cache'
        );
    }

    public function test_cache_key_is_the_navigation_path_prefix(): void
    {
        $svc = $this->service();
        $svc->addReplyRecord('2');
        $svc->addReplyRecord('1');

        //  The prefix that reached each level = the responses consumed before it.
        $svc->level = 1; $this->assertSame('',    $this->invokePrivate($svc, 'currentReplayPathKey'));
        $svc->level = 2; $this->assertSame('2',   $this->invokePrivate($svc, 'currentReplayPathKey'));
        $svc->level = 3; $this->assertSame('2*1', $this->invokePrivate($svc, 'currentReplayPathKey'));
    }

    public function test_going_back_unsets_the_abandoned_branch_cache(): void
    {
        $svc = $this->service();

        //  After a go-back the current path is "2*1"; the deeper "2*1*1" branch was abandoned.
        $svc->addReplyRecord('2');
        $svc->addReplyRecord('1');

        $map = [
            '|get|http://a'      => ['body' => 'home',     'status' => 200],  // prefix ""      (on path)
            '2|get|http://b'     => ['body' => 'services', 'status' => 200],  // prefix "2"     (on path)
            '2*1|get|http://c'   => ['body' => 'educated', 'status' => 200],  // prefix "2*1"   (current, on path)
            '2*1*1|get|http://d' => ['body' => 'topics',   'status' => 200],  // prefix "2*1*1" (ABANDONED)
        ];

        $kept = $this->invokePrivate($svc, 'pruneScreenHttpToCurrentPath', [$map]);

        $this->assertArrayHasKey('|get|http://a', $kept);
        $this->assertArrayHasKey('2|get|http://b', $kept);
        $this->assertArrayHasKey('2*1|get|http://c', $kept);
        $this->assertArrayNotHasKey(
            '2*1*1|get|http://d', $kept,
            'the cache for the branch we left on go-back must be unset'
        );
    }

    public function test_token_prefix_does_not_false_match_similar_digits(): void
    {
        //  Current path "1" must NOT keep an entry keyed under prefix "12" (string-prefix
        //  trap): they are different response tokens.
        $svc = $this->service();
        $svc->addReplyRecord('1');

        $kept = $this->invokePrivate($svc, 'pruneScreenHttpToCurrentPath', [[
            '12|get|http://x' => ['body' => 'x', 'status' => 200],
        ]]);

        $this->assertArrayNotHasKey('12|get|http://x', $kept, 'token "12" is not on path "1"');
    }
}
