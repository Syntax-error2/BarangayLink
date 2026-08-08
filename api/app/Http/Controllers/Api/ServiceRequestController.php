<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ServiceRequest;
use App\Models\User;
use App\Notifications\ResidentStatusUpdate;

class ServiceRequestController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = ServiceRequest::with(['serviceType', 'user', 'barangay']);
        
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
            'service_type_id' => 'required|exists:service_types,id',
            'remarks' => 'nullable|string',
        ]);
        
        $user = $request->user();
        $validated['user_id'] = $user->id;
        $validated['barangay_id'] = $user->barangay_id ?: 1;
        $validated['status'] = 'SUBMITTED';

        $request = ServiceRequest::create($validated);
        
        return response()->json($request, 201);
    }

    public function update(Request $request, ServiceRequest $serviceRequest)
    {
        $validated = $request->validate([
            'status' => 'required|string'
        ]);

        $serviceRequest->update(['status' => $validated['status']]);

        // Dispatch Notification
        $serviceRequest->user->notify(new ResidentStatusUpdate(
            'Service',
            $serviceRequest->serviceType->name,
            $validated['status'],
            $serviceRequest->id
        ));

        return response()->json($serviceRequest);
    }
}