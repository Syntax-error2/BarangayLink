<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Report;
use App\Models\ServiceRequest;
use App\Models\EmergencyReport;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function adminDashboard(Request $request)
    {
        $barangayId = $request->user()->barangay_id;
        $query = function ($q) use ($barangayId) {
            if ($barangayId) $q->where('barangay_id', $barangayId);
        };

        // Chart Data: Last 7 days reports
        $chartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $count = Report::where($query)->whereDate('created_at', $date)->count();
            $chartData[] = [
                'name' => Carbon::parse($date)->format('D'),
                'reports' => $count
            ];
        }

        // Recent Activity: 5 latest reports
        $recentActivity = Report::where($query)
            ->with(['user' => function($q) { $q->select('id', 'first_name', 'last_name'); }])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return response()->json([
            'total_reports' => Report::where($query)->count(),
            'pending_requests' => ServiceRequest::where($query)->whereIn('status', ['SUBMITTED', 'UNDER REVIEW'])->count(),
            'active_emergencies' => EmergencyReport::where($query)->whereNotIn('status', ['RESOLVED', 'CLOSED', 'FALSE ALARM'])->count(),
            'resolved_reports' => Report::where($query)->whereIn('status', ['RESOLVED', 'CLOSED'])->count(),
            'chart_data' => $chartData,
            'recent_activity' => $recentActivity
        ]);
    }

    public function getUnreadCounts(Request $request)
    {
        $barangayId = $request->user()->barangay_id;
        $query = function ($q) use ($barangayId) {
            if ($barangayId) $q->where('barangay_id', $barangayId);
        };

        return response()->json([
            'services' => ServiceRequest::where($query)->whereIn('status', ['SUBMITTED', 'UNDER REVIEW'])->count(),
            'emergencies' => EmergencyReport::where($query)->whereIn('status', ['PENDING', 'DISPATCHED', 'IN PROGRESS'])->count(),
            'reports' => Report::where($query)->whereIn('status', ['PENDING', 'IN PROGRESS', 'UNDER REVIEW'])->count()
        ]);
    }
}