<?php

namespace Database\Factories;

use App\Models\Country;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'description' => fake()->paragraph(),
            'author' => fake()->name(),
            'price' => fake()->randomFloat(2, 100, 50_000),
            'img' => fake()->numerify('##').'.jpg',
            'country_id' => fn () => Country::query()->inRandomOrder()->value('id')
                ?? Country::factory()->create()->id,
        ];
    }
}
