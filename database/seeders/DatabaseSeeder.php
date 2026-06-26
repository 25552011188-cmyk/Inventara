<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RoleSeeder::class);

        $admin = User::create([
            'name' => 'Admin Gudang',
            'email' => 'admin@inventara.com',
            'password' => bcrypt('password123'),
        ]);
        $admin->assignRole('Admin');

        $staff = User::create([
            'name' => 'Staff Gudang',
            'email' => 'staff@inventara.com',
            'password' => bcrypt('password123'),
        ]);
        $staff->assignRole('Staff');

        $manager = User::create([
            'name' => 'Manager Gudang',
            'email' => 'manager@inventara.com',
            'password' => bcrypt('password123'),
        ]);
        $manager->assignRole('Manager');
    }
}
