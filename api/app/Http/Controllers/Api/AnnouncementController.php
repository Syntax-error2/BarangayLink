<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Announcement;

class AnnouncementController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Announcement::with('author');
        
        if ($user->barangay_id) {
            $query->where('barangay_id', $user->barangay_id);
        }
        
        return response()->json($query->latest()->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'nullable|string|max:50',
        ]);

        $user = $request->user();

        $announcement = Announcement::create([
            'title' => $request->title,
            'content' => $request->content,
            'type' => $request->type ?? 'General',
            'barangay_id' => $user->barangay_id,
            'author_id' => $user->id,
            'is_active' => true,
        ]);

        // Trigger Proactive AI Alert
        $lowerTitle = strtolower($announcement->title);
        $lowerContent = strtolower($announcement->content);
        $aiMessage = null;

        if (str_contains($lowerTitle, 'typhoon') || str_contains($lowerTitle, 'storm') || str_contains($lowerContent, 'typhoon')) {
            $aiMessage = "Hello! A typhoon warning was just issued for our Barangay. Should I pull up the nearest evacuation center for you?";
        } elseif (str_contains($lowerTitle, 'flood') || str_contains($lowerContent, 'flood')) {
            $aiMessage = "Hi there, a flood warning was just announced. Do you want me to check the emergency dispatch numbers or safe routes?";
        } elseif (str_contains($lowerTitle, 'water') || str_contains($lowerTitle, 'power')) {
            $aiMessage = "Hello, a utility interruption was just announced. Do you want me to check the expected restoration time or report a localized outage?";
        }

        if ($aiMessage) {
            // Find residents in the same barangay
            $residents = \App\Models\User::whereHas('role', function($q) {
                $q->where('slug', 'resident')->orWhere('name', 'Resident');
            })->where('barangay_id', $user->barangay_id)->get();

            if ($residents->count() === 0) {
                // Fallback if role mapping is different
                $residents = \App\Models\User::where('role_id', 3) // Assuming 3 is resident
                    ->where('barangay_id', $user->barangay_id)->get();
            }

            \Illuminate\Support\Facades\Notification::send($residents, new \App\Notifications\ProactiveAiAlert($aiMessage, $announcement->title, $announcement->id));
        }

        return response()->json($announcement, 201);
    }
}