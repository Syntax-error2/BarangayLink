<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\ReportCategory;
use App\Models\ServiceType;
use App\Models\EmergencyCategory;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $reportCats = ['Road damage', 'Flooding', 'Garbage problems', 'Broken streetlights', 'Water problems', 'Public safety', 'Noise complaints'];
        foreach ($reportCats as $c) ReportCategory::firstOrCreate(['name' => $c]);

        $services = ['Barangay clearance', 'Certificate of residency', 'Certificate of indigency', 'Business permit clearance'];
        foreach ($services as $s) ServiceType::firstOrCreate(['name' => $s]);

        $emergencies = ['Fire', 'Medical emergency', 'Accident', 'Flood', 'Crime', 'Other'];
        foreach ($emergencies as $e) EmergencyCategory::firstOrCreate(['name' => $e]);
    }
}