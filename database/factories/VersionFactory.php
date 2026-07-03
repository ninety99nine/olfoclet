<?php

namespace Database\Factories;

use App\Models\App;
use App\Models\Version;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Version>
 *
 * By default `builder` is left null so the VersionObserver seeds it from
 * getBuilderTemplate() (mirrors real creation). Pass an explicit builder array
 * to run tests against a specific flow, e.g. Version::factory()->withBuilder($b).
 */
class VersionFactory extends Factory
{
    protected $model = Version::class;

    public function definition(): array
    {
        return [
            'number' => 1.00,
            'description' => $this->faker->sentence(),
            'app_id' => App::factory(),
            'builder' => null,
        ];
    }

    /** Use a specific builder array (bypasses the template default). */
    public function withBuilder(array $builder): static
    {
        return $this->state(fn () => ['builder' => $builder]);
    }
}
