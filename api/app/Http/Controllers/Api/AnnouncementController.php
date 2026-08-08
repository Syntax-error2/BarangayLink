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

        return response()->json($announcement, 201);
    }
}