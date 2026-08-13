<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Report;
use App\Models\EmergencyReport;

class MapController extends Controller
{
    public function getMapData(Request $request)
    {
        $barangayId = $request->user()->barangay_id;
        $query = function ($q) use ($barangayId) {
            if ($barangayId) $q->where("barangay_id", $barangayId);
        };

        $reports = Report::where($query)
            ->whereNotNull("latitude")
            ->whereNotNull("longitude")
            ->select("id", "title", "category_id", "status", "latitude", "longitude", "created_at")
            ->with("category:id,name")
            ->get()
            ->map(function ($item) {
                return [
                    "id" => $item->id,
                    "type" => "report",
                    "title" => $item->title,
                    "category" => $item->category ? $item->category->name : "General",
                    "status" => $item->status,
                    "lat" => (float) $item->latitude,
                    "lng" => (float) $item->longitude,
                    "date" => $item->created_at->toIso8601String()
                ];
            });

        $emergencies = EmergencyReport::where($query)
            ->whereNotNull("latitude")
            ->whereNotNull("longitude")
            ->select("id", "type_id", "status", "latitude", "longitude", "created_at")
            ->with("type:id,name")
            ->get()
            ->map(function ($item) {
                return [
                    "id" => $item->id,
                    "type" => "emergency",
                    "title" => $item->type ? $item->type->name . " Emergency" : "Emergency",
                    "category" => "Emergency",
                    "status" => $item->status,
                    "lat" => (float) $item->latitude,
                    "lng" => (float) $item->longitude,
                    "date" => $item->created_at->toIso8601String()
                ];
            });

        return response()->json([
            "points" => $reports->concat($emergencies)
        ]);
    }
}
