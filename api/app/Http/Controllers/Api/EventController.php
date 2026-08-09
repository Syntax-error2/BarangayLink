<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Event;
use Carbon\Carbon;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $barangayId = $request->user()->barangay_id;

        $events = Event::where('barangay_id', $barangayId)
            ->orderBy('start_date', 'asc')
            ->get();

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

        $event = new Event();
        $event->barangay_id = $request->user()->barangay_id;
        $event->title = $request->title;
        $event->description = $request->description;
        $event->start_date = Carbon::parse($request->start_date)->format('Y-m-d H:i:s');
        if ($request->end_date) {
            $event->end_date = Carbon::parse($request->end_date)->format('Y-m-d H:i:s');
        }
        $event->location = $request->location;
        $event->is_published = $request->is_published ?? true;
        $event->created_by = $request->user()->id;
        $event->save();

        return response()->json($event, 201);
    }

    public function destroy(Request $request, $id)
    {
        $event = Event::where('barangay_id', $request->user()->barangay_id)
            ->findOrFail($id);
            
        $event->delete();
        
        return response()->json(['message' => 'Event deleted']);
    }
}
