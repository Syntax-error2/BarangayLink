<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\EmergencyReport;

class EmergencyController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = EmergencyReport::with('category', 'user');
        
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
            'category_id' => 'required|exists:emergency_categories,id',
            'contact_name' => 'required|string',
            'contact_phone' => 'required|string',
            'address' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'description' => 'nullable|string',
        ]);
        
        $user = $request->user();
        $validated['user_id'] = $user->id;
        $validated['barangay_id'] = $user->barangay_id ?: 1;
        $validated['status'] = 'REPORTED';

        $emergency = EmergencyReport::create($validated);
        
        return response()->json($emergency, 201);
    }
}