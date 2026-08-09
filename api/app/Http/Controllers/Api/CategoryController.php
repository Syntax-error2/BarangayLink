<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\ReportCategory;
use App\Models\ServiceType;
use App\Models\EmergencyCategory;

class CategoryController extends Controller
{
    public function getCategories()
    {
        return response()->json([
            'reports' => ReportCategory::where('is_active', true)->get(),
            'services' => ServiceType::where('is_active', true)->get()->push([
                'id' => 999,
                'name' => 'Medicine Request',
                'description' => 'Request medical assistance or free medicine from the Barangay Health Center',
                'is_active' => true
            ])->unique('name')->values(),
            'emergencies' => EmergencyCategory::where('is_active', true)->get(),
        ]);
    }
}