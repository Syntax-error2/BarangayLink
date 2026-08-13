<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Event;
use Carbon\Carbon;
use App\Services\AuditLogService;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Event::query();

        if ($user->barangay_id) {
            $query->where('barangay_id', $user->barangay_id);
        }

        $events = $query->orderBy('start_date', 'asc')->get();

        return response()->json($events);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'location' => 'required|string|max:255',
            'is_published' => 'boolean',
        ]);

        $user = $request->user();
        $barangayId = $user->barangay_id;
        
        // If super admin (no barangay_id), default to first barangay for now
        if (!$barangayId) {
            $firstBarangay = \App\Models\Barangay::first();
            if ($firstBarangay) {
                $barangayId = $firstBarangay->id;
            }
        }

        $event = new Event();
        $event->barangay_id = $barangayId;
        $event->title = $request->title;
        $event->description = $request->description;
        $event->start_date = Carbon::parse($request->start_date)->format('Y-m-d H:i:s');
        if ($request->end_date) {
            $event->end_date = Carbon::parse($request->end_date)->format('Y-m-d H:i:s');
        }
        $event->location = $request->location;
        $event->is_published = $request->is_published ?? true;
        $event->created_by = $user->id ?? 1;
        $event->save();

        AuditLogService::log('created', 'events', 'Created event: ' . $event->title, $event->id);

        return response()->json($event, 201);
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $query = Event::query();
        
        if ($user->barangay_id) {
            $query->where('barangay_id', $user->barangay_id);
        }

        $event = $query->findOrFail($id);
        
        AuditLogService::log('deleted', 'events', 'Deleted event: ' . $event->title, $event->id);
        
        $event->delete();
        
        return response()->json(['message' => 'Event deleted']);
    }
}
