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

        // Chart Data: Last 7 days reports (New, Resolved, Pending)
        $chartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $chartData[] = [
                'name' => Carbon::parse($date)->format('M d'),
                'new_reports' => Report::where($query)->whereDate('created_at', $date)->whereIn('status', ['SUBMITTED', 'RECEIVED'])->count(),
                'resolved' => Report::where($query)->whereDate('created_at', $date)->whereIn('status', ['RESOLVED', 'CLOSED'])->count(),
                'pending' => Report::where($query)->whereDate('created_at', $date)->whereIn('status', ['VERIFIED', 'ASSIGNED', 'IN PROGRESS'])->count(),
            ];
        }

        // Recent Activity: 5 latest reports
        $recentActivity = Report::where($query)
            ->with(['category', 'user' => function($q) { $q->select('id', 'first_name', 'last_name', 'profile_photo_path'); }])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Reports by Category
        $reportsByCategory = Report::where($query)
            ->select('category_id', DB::raw('count(*) as total'))
            ->groupBy('category_id')
            ->with('category')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->category ? $item->category->name : 'Unknown',
                    'value' => $item->total
                ];
            });

        // Reports by Status
        $reportsByStatus = Report::where($query)
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->status,
                    'value' => $item->total
                ];
            });

        // Top Areas
        $topAreas = Report::where($query)
            ->select('address', DB::raw('count(*) as total'))
            ->groupBy('address')
            ->orderBy('total', 'desc')
            ->take(5)
            ->get();

        // Upcoming Events
        $upcomingEvents = \App\Models\Event::where($query)
            ->where('start_date', '>=', Carbon::now())
            ->orderBy('start_date', 'asc')
            ->take(3)
            ->get();

        // System Alerts
        $systemAlerts = \App\Models\SystemAlert::where($query)
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get();
            
        // Pending Service Requests
        $pendingRequests = ServiceRequest::where($query)
            ->with(['serviceType', 'user' => function($q) { $q->select('id', 'first_name', 'last_name'); }])
            ->whereIn('status', ['SUBMITTED', 'UNDER REVIEW'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Total Residents
        $totalResidents = \App\Models\User::where('barangay_id', $barangayId)
            ->whereHas('role', function($q) { $q->where('name', 'Resident'); })
            ->count();
            
        // Active Announcements
        $activeAnnouncements = \App\Models\Announcement::where($query)
            ->where('is_published', true)
            ->count();

        return response()->json([
            'total_reports' => Report::where($query)->count(),
            'pending_requests_count' => ServiceRequest::where($query)->whereIn('status', ['SUBMITTED', 'UNDER REVIEW'])->count(),
            'total_residents' => $totalResidents,
            'active_announcements' => $activeAnnouncements,
            
            'active_emergencies' => EmergencyReport::where($query)->whereNotIn('status', ['RESOLVED', 'CLOSED', 'FALSE ALARM'])->count(),
            'chart_data' => $chartData,
            
            'reports_by_category' => $reportsByCategory,
            'reports_by_status' => $reportsByStatus,
            'top_areas' => $topAreas,
            
            'recent_activity' => $recentActivity,
            'pending_service_requests' => $pendingRequests,
            'upcoming_events' => $upcomingEvents,
            'system_alerts' => $systemAlerts,
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