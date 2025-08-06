<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create EasyBook Administrator with employee privileges
        User::factory()
            ->state([
                'name' => 'EasyBookAdministrator',
                'email' => 'admin33@gmail.com',
                'password' => Hash::make('admin33'),
                'app_employee' => 1,
            ])
            ->create();

        // Create regular application users
        User::factory()
            ->count(20)
            ->create();
    }
}
