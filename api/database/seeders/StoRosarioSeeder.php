<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Barangay;
use App\Models\ServiceRequest;
use App\Models\ServiceType;

class StoRosarioSeeder extends Seeder
{
    public function run()
    {
        $brgy = Barangay::where('name', 'LIKE', '%Santo Rosario%')->first();
        if (!$brgy) {
            echo "Brgy. Santo Rosario not found!\n";
            return;
        }

        User::query()->update(['barangay_id' => $brgy->id]);
        echo "Updated all users to Barangay ID: {$brgy->id} ({$brgy->name})\n";

        // Create some dummy service requests
        $resident = User::whereHas('role', function($q) {
            $q->where('slug', 'resident');
        })->first();

        if (!$resident) {
            echo "No resident found to assign requests to.\n";
            return;
        }

        $serviceTypes = [
            ['name' => 'Barangay Clearance', 'description' => 'For employment purposes'],
            ['name' => 'Certificate of Indigency', 'description' => 'For scholarship'],
            ['name' => 'Business Permit', 'description' => 'For sari-sari store']
        ];

        foreach ($serviceTypes as $type) {
            $st = ServiceType::firstOrCreate(['name' => $type['name']], $type);
            
            ServiceRequest::create([
                'user_id' => $resident->id,
                'barangay_id' => $brgy->id,
                'service_type_id' => $st->id,
                'status' => 'SUBMITTED',
                'remarks' => 'Test request for UI check. Please process ASAP.'
            ]);
        }

        echo "Created dummy service requests.\n";
    }
}
