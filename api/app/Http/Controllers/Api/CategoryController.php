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
            'services' => ServiceType::where('is_active', true)->get(),
            'emergencies' => EmergencyCategory::where('is_active', true)->get(),
        ]);
    }
}