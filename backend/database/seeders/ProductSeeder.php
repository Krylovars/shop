<?php

namespace Database\Seeders;

use App\Models\Country;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $franceId = Country::query()->where('name', 'Франция')->value('id');

        if ($franceId === null) {
            $franceId = Country::query()->create(['name' => 'Франция'])->id;
        }

        $rows = [
            [
                'name' => 'Охота Амура',
                'author' => 'Марсель Руссо',
                'description' => 'Холст, масло (50х80)',
                'price' => 14500,
                'img' => '1.jpg',
            ],
            [
                'name' => 'Дама с собачкой',
                'author' => 'Анри Селин',
                'description' => 'Акрил, бумага (50х80)',
                'price' => 16500,
                'img' => '2.jpg',
            ],
            [
                'name' => 'Процедура',
                'author' => 'Франсуа Дюпон',
                'description' => 'Цветная литография (40х60)',
                'price' => 20000,
                'img' => '3.jpg',
            ],
            [
                'name' => 'Роза',
                'author' => 'Луи Детуш',
                'description' => 'Бумага, акрил (50х80)',
                'price' => 12000,
                'img' => '4.jpg',
            ],
            [
                'name' => 'Птичья трапеза',
                'author' => 'Франсуа Дюпон',
                'description' => 'Цветная литография (40х60)',
                'price' => 22500,
                'img' => '5.jpg',
            ],
            [
                'name' => 'Пейзаж с рыбой',
                'author' => 'Пьер Моранж',
                'description' => 'Цветная литография (40х60)',
                'price' => 20000,
                'img' => '6.jpg',
            ],
        ];

        foreach ($rows as $row) {
            Product::query()->updateOrCreate(
                [
                    'name' => $row['name']
                ],
                [
                    ...$row,
                    'country_id' => $franceId,
                ],
            );
        }
    }
}
