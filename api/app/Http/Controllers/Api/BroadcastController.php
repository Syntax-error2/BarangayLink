<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SystemAlert;
use App\Models\Announcement;
use App\Models\Notification;
use App\Models\User;

class BroadcastController extends Controller
{
    public function sendBroadcast(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
            'type' => 'required|string',
            'audience' => 'required|string'
        ]);

        $barangayId = $request->user()->barangay_id;
        $title = 'Broadcast Message';

        if ($request->type === 'emergency' || $request->type === 'alert') {
            // Create System Alert
            SystemAlert::create([
                'barangay_id' => $barangayId,
                'title' => $request->type === 'emergency' ? 'EMERGENCY ALERT' : 'SYSTEM ALERT',
                'message' => $request->message,
                'type' => $request->type === 'emergency' ? 'critical' : 'warning',
                'is_active' => true,
                'created_by' => $request->user()->id
            ]);
            $title = $request->type === 'emergency' ? 'EMERGENCY ALERT' : 'SYSTEM ALERT';
        } else {
            // Create Announcement
            Announcement::create([
                'barangay_id' => $barangayId,
                'title' => 'Broadcast Announcement',
                'content' => $request->message,
                'type' => 'General',
                'is_published' => true,
                'created_by' => $request->user()->id
            ]);
            $title = 'New Announcement';
        }

        // Generate Notifications for the audience
        $query = User::where('barangay_id', $barangayId)->where('is_active', true);
        if ($request->audience === 'residents') {
            $query->whereHas('role', function($q) { $q->where('slug', 'resident'); });
        } else if ($request->audience === 'staff') {
            $query->whereHas('role', function($q) { $q->whereIn('slug', ['staff', 'responder']); });
        }

        $users = $query->get();

        // In a real app, you would chunk this or use a Queue/Job
        foreach ($users as $user) {
            Notification::create([
                'user_id' => $user->id,
                'type' => 'broadcast',
                'title' => $title,
                'message' => $request->message,
                'is_read' => false
            ]);
        }

        return response()->json(['message' => 'Broadcast sent successfully and notifications generated.']);
    }
}
