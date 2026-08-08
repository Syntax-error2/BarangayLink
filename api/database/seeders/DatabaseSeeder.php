<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Barangay;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create Roles
        $roles = [
            ['name' => 'Super Administrator', 'slug' => 'super-admin'],
            ['name' => 'Barangay Administrator', 'slug' => 'barangay-admin'],
            ['name' => 'Barangay Staff', 'slug' => 'staff'],
            ['name' => 'Responder', 'slug' => 'responder'],
            ['name' => 'Resident', 'slug' => 'resident'],
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(['slug' => $role['slug']], $role);
        }

        // Create Barangays
        $barangayNames = [
            'Amontay', 'Bagroy', 'Bi-ao', 'Canmoros', 'Enclaro', 
            'Marina', 'Pagla-um', 'Payao', 'Progreso', 'San Jose', 
            'San Juan', 'San Pedro', 'San Teodoro', 'San Vicente', 
            'Santo Rosario', 'Santol'
        ];

        $firstBarangay = null;
        foreach ($barangayNames as $name) {
            $b = Barangay::firstOrCreate(
                ['name' => $name],
                [
                    'city' => 'Binalbagan',
                    'province' => 'Negros Occidental',
                    'region' => 'Region VI',
                ]
            );
            if (!$firstBarangay) {
                $firstBarangay = $b;
            }
        }
        
        $barangay = $firstBarangay;

        // Fetch roles
        $superAdminRole = Role::where('slug', 'super-admin')->first();
        $adminRole = Role::where('slug', 'barangay-admin')->first();
        $staffRole = Role::where('slug', 'staff')->first();
        $responderRole = Role::where('slug', 'responder')->first();
        $residentRole = Role::where('slug', 'resident')->first();

        $password = Hash::make('password123');

        // Super Admin
        User::firstOrCreate(
            ['email' => 'superadmin@barangaylink.com'],
            [
                'first_name' => 'Super',
                'last_name' => 'Admin',
                'password' => $password,
                'role_id' => $superAdminRole->id,
                'barangay_id' => null,
                'phone' => '09123456789'
            ]
        );

        // Barangay Admin
        User::firstOrCreate(
            ['email' => 'admin@barangaylink.com'],
            [
                'first_name' => 'Barangay',
                'last_name' => 'Admin',
                'password' => $password,
                'role_id' => $adminRole->id,
                'barangay_id' => $barangay->id,
                'phone' => '09123456788'
            ]
        );

        // Staff
        for ($i = 1; $i <= 2; $i++) {
            $user = User::firstOrCreate(
                ['email' => "staff{$i}@barangaylink.com"],
                [
                    'first_name' => 'Staff',
                    'last_name' => (string)$i,
                    'password' => $password,
                    'role_id' => $staffRole->id,
                    'barangay_id' => $barangay->id,
                    'phone' => '0912345670' . $i
                ]
            );
            $user->staffProfile()->firstOrCreate([], ['position' => 'Clerk', 'department' => 'Administration']);
        }

        // Responder
        for ($i = 1; $i <= 2; $i++) {
            $user = User::firstOrCreate(
                ['email' => "responder{$i}@barangaylink.com"],
                [
                    'first_name' => 'Responder',
                    'last_name' => (string)$i,
                    'password' => $password,
                    'role_id' => $responderRole->id,
                    'barangay_id' => $barangay->id,
                    'phone' => '0912345680' . $i
                ]
            );
            $user->responderProfile()->firstOrCreate([], ['unit' => 'Emergency Response Team', 'specialty' => 'Medic']);
        }

        // Residents
        for ($i = 1; $i <= 5; $i++) {
            $user = User::firstOrCreate(
                ['email' => "resident{$i}@barangaylink.com"],
                [
                    'first_name' => 'Resident',
                    'last_name' => (string)$i,
                    'password' => $password,
                    'role_id' => $residentRole->id,
                    'barangay_id' => $barangay->id,
                    'phone' => '0912345690' . $i
                ]
            );
            $user->residentProfile()->firstOrCreate([], [
                'address' => "Block {$i} Lot {$i}, Binalbagan",
                'emergency_contact_name' => 'Contact ' . $i,
                'emergency_contact_phone' => '0999888776' . $i
            ]);
        }
    }
}
