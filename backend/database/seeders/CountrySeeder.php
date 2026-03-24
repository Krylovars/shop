<?php

namespace Database\Seeders;

use App\Models\Country;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CountrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $names = ['Россия', 'Франция', 'Италия', 'Германия', 'Испания'];
        foreach ($names as $name) {
            Country::query()->firstOrCreate(['name' => $name]);
        }
    }
}
