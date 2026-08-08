<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Barangay;

class PrintBarangaysSeeder extends Seeder
{
    public function run()
    {
        $brgys = Barangay::all();
        foreach ($brgys as $b) {
            echo "{$b->id}: {$b->name}\n";
        }
    }
}
