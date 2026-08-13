<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SystemAlert;
use App\Models\Announcement;
use App\Models\User;
use Illuminate\Support\Facades\Notification;
use App\Notifications\BroadcastMessage;

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
        $notifType = 'broadcast';

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
            $notifType = 'emergency_alert';
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
            $notifType = 'general_announcement';
        }

        // Generate Notifications for the audience
        $query = User::where('is_active', true);
        
        // Handle Super Admin broadcast (all barangays) or specific barangay
        if ($barangayId) {
            $query->where('barangay_id', $barangayId);
        }

        if ($request->audience === 'residents') {
            $query->whereHas('role', function($q) { $q->where('slug', 'resident'); });
        } else if ($request->audience === 'staff') {
            $query->whereHas('role', function($q) { $q->whereIn('slug', ['staff', 'responder']); });
        }

        $users = $query->get();

        if ($users->count() > 0) {
            Notification::send($users, new BroadcastMessage($title, $request->message, $notifType));
        }

        return response()->json(['message' => 'Broadcast sent successfully and notifications generated.']);
    }
}
