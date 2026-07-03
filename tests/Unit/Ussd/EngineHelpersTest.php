<?php

namespace Tests\Unit\Ussd;

use App\Services\Ussd\UssdService;
use Illuminate\Http\Request;
use PHPUnit\Framework\TestCase;
use ReflectionClass;

/**
 * Characterisation tests for the small, state-light engine helpers that File 01
 * rewrites internally for performance:
 *   - removeEmojis()              -> Problem 2  (7 regex passes -> 1)
 *   - extractUserResponsesAsText()-> Problem 14 (memoisation)
 *   - searchScreenById()/getDisplayById() -> Problem 12 (hash-map indexing)
 *
 * These pin the *observable output* of each method. The refactors change how the
 * result is computed, never what it is — so every assertion here must stay green
 * through files 01/02/03. (No DB needed; the constructor only stores the request.)
 */
class EngineHelpersTest extends TestCase
{
    private function makeService(): UssdService
    {
        return new UssdService(Request::create('/', 'POST'));
    }

    private function setProp(UssdService $svc, string $prop, mixed $value): void
    {
        $p = (new ReflectionClass($svc))->getProperty($prop);
        $p->setAccessible(true);
        $p->setValue($svc, $value);
    }

    /** @dataProvider emojiCases */
    public function test_remove_emojis_strips_pictographs_but_keeps_plain_text(string $in, string $out): void
    {
        $this->assertSame($out, $this->makeService()->removeEmojis($in));
    }

    public static function emojiCases(): array
    {
        return [
            'grinning + plane' => ['Hi 😀 there ✈', 'Hi  there '],
            'plain ascii untouched' => ['Plain ASCII 123', 'Plain ASCII 123'],
            'menu text untouched' => ["1. Join\n2. Exit", "1. Join\n2. Exit"],
            'emoji only' => ['🚀🔥', ''],
            'setswana letters kept' => ['Dumela mma', 'Dumela mma'],
        ];
    }

    public function test_extract_user_responses_joins_user_inputs_with_star_and_ignores_auto_replies(): void
    {
        $records = [
            ['value' => '1', 'origin' => 'user', 'removable' => true],
            ['value' => '0', 'origin' => 'auto_reply', 'removable' => true],
            ['value' => 'John', 'origin' => 'user', 'removable' => true],
        ];

        $this->assertSame('1*John', $this->makeService()->extractUserResponsesAsText($records));
    }

    public function test_extract_user_responses_on_empty_is_empty_string(): void
    {
        $this->assertSame('', $this->makeService()->extractUserResponsesAsText([]));
    }

    public function test_search_screen_by_id_returns_matching_screen_or_null(): void
    {
        $svc = $this->makeService();
        $screens = [
            ['id' => 'screen_A', 'name' => 'Alpha', 'displays' => [['id' => 'disp_1'], ['id' => 'disp_2']]],
            ['id' => 'screen_B', 'name' => 'Beta', 'displays' => [['id' => 'disp_3']]],
        ];
        $this->setProp($svc, 'screens', $screens);

        $this->assertSame('Beta', $svc->searchScreenById('screen_B')['name']);
        $this->assertNull($svc->searchScreenById('does_not_exist'));
    }

    public function test_get_display_by_id_finds_in_current_screen_and_globally(): void
    {
        $svc = $this->makeService();
        $screens = [
            ['id' => 'screen_A', 'name' => 'Alpha', 'displays' => [['id' => 'disp_1'], ['id' => 'disp_2']]],
            ['id' => 'screen_B', 'name' => 'Beta', 'displays' => [['id' => 'disp_3']]],
        ];
        $this->setProp($svc, 'screens', $screens);
        $this->setProp($svc, 'screen', $screens[0]);

        // In the current screen.
        $this->assertSame('disp_2', $svc->getDisplayById('disp_2')['id']);

        // On another screen, only found with the global-search flag.
        $this->assertSame('disp_3', $svc->getDisplayById('disp_3', true)['id']);
    }
}
