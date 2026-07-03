<?php

namespace Database\Factories;

use App\Models\App;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<App>
 */
class AppFactory extends Factory
{
    protected $model = App::class;

    public function definition(): array
    {
        return [
            'name' => 'App '.$this->faker->numberBetween(1000, 9999),
            'description' => $this->faker->sentence(),
            'online' => true,
            'active_version_id' => null,
            'project_id' => Project::factory(),
            'confirmation_code' => strtoupper($this->faker->bothify('??####')),
        ];
    }
}
