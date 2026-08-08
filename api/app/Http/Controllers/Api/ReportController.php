<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Report;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Report::with('category', 'user');
        
        if ($user->role->slug === 'resident') {
            $query->where('user_id', $user->id);
        } else if ($user->barangay_id) {
            $query->where('barangay_id', $user->barangay_id);
        }
        
        return response()->json($query->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:report_categories,id',
            'title' => 'required|string',
            'description' => 'required|string',
            'address' => 'required|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);
        
        $user = $request->user();
        $validated['user_id'] = $user->id;
        $validated['barangay_id'] = $user->barangay_id ?: 1;
        $validated['status'] = 'SUBMITTED';

        $report = Report::create($validated);
        
        return response()->json($report, 201);
    }
    
    public function show(Report $report)
    {
        return response()->json($report->load('category', 'user', 'statusHistories', 'assignments.responder'));
    }
    
    public function updateStatus(Request $request, Report $report)
    {
        $validated = $request->validate([
            'status' => 'required|string',
            'remarks' => 'nullable|string'
        ]);
        
        $report->update(['status' => $validated['status']]);
        $report->statusHistories()->create([
            'user_id' => $request->user()->id,
            'status' => $validated['status'],
            'remarks' => $validated['remarks']
        ]);
        
        // Dispatch Notification
        $report->user->notify(new \App\Notifications\ResidentStatusUpdate(
            'Report',
            $report->title,
            $validated['status'],
            $report->id
        ));
        
        return response()->json($report);
    }
}