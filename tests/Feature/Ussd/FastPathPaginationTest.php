<?php

namespace Tests\Feature\Ussd;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Support\DialsUssd;
use Tests\Support\FirstAidApp;
use Tests\Support\Personas;
use Tests\TestCase;

/**
 * Proves the session-state fast-path paginates a long list byte-identically to a full
 * replay — the case that regressed: the fast-path used to return the cached render of the
 * FIRST page on every "Next" (99), so scrolling never advanced. We reach the First-Aid
 * Topics screen (a display-paginated list) and scroll several pages with the flag OFF then
 * ON, asserting identical output and that the fast-path actually resumed.
 *
 * @group golden
 */
class FastPathPaginationTest extends TestCase
{
    use RefreshDatabase;
    use DialsUssd;

    /** Subscriber (profiled) on-start + a 30-item topics list that paginates across pages. */
    private function configure(): callable
    {
        $persona = Personas::subscribed();
        $topics = ['data' => [], 'meta' => ['total' => 30, 'last_page' => 1, 'per_page' => 100, 'current_page' => 1], 'links' => ['next' => null]];
        for ($i = 1; $i <= 30; $i++) {
            $topics['data'][] = ['id' => $i, 'title' => "Topic Number $i"];
        }

        return function ($svc) use ($persona, $topics) {
            $svc->defaultResponse = $persona;
            $svc->cannedResponses = [
                ['match' => fn ($url, $m) => str_contains($url, 'children'), 'status' => 200, 'body' => $topics],
            ];
        };
    }

    /** @return array{0: list<string>, 1: int} [transcript, total fast-path restores] */
    private function scroll(bool $fastPath, string $sid): array
    {
        config(['ussd.fast_path' => $fastPath]);
        $app = FirstAidApp::create();
        $cfg = $this->configure();
        $v = $app->version->id;
        $m = $app->msisdn;

        $t = [];
        $restores = 0;
        $t[] = $this->dialUssd(['test_mode' => true, 'version_id' => $v, 'msisdn' => $m, 'session_id' => $sid, 'request_type' => '1', 'msg' => '*217#'], $cfg)['msg'] ?? '?';
        $restores += $this->lastUssdService->fastPathRestoreCount;

        //  Home -> Services -> Get Educated -> Topics, then scroll Next (99) several pages.
        foreach (['2', '1', '1', '99', '99', '99'] as $in) {
            $t[] = $this->dialUssd(['test_mode' => true, 'version_id' => $v, 'msisdn' => $m, 'session_id' => $sid, 'request_type' => '2', 'msg' => $in], $cfg)['msg'] ?? '?';
            $restores += $this->lastUssdService->fastPathRestoreCount;
        }

        return [$t, $restores];
    }

    public function test_fast_path_pagination_matches_replay(): void
    {
        [$off] = $this->scroll(false, 'pg-off');
        [$on, $restores] = $this->scroll(true, 'pg-on');

        $this->assertGreaterThan(0, $restores, 'flag on must actually resume from a box');
        //  Scrolling must advance pages, not repeat page 1.
        $this->assertStringContainsString('1. Topic Number 1', $off[3], 'page 1 starts at topic 1');
        $this->assertStringContainsString('Topic Number 8', $off[4], 'first Next advances to page 2 (topic 8+)');
        $this->assertStringContainsString('Topic Number 15', $off[5], 'second Next advances to page 3 (topic 15+)');
        $this->assertSame($off, $on, 'fast-path pagination must equal replay');
    }
}
