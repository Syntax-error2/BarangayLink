<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;

class UserController extends Controller
{
    public function getResidents(Request $request)
    {
        $user = $request->user();
        
        $query = User::with(['residentProfile', 'role'])
            ->whereHas('role', function ($q) {
                $q->where('slug', 'resident');
            });

        if ($user->barangay_id) {
            $query->where('barangay_id', $user->barangay_id);
        }
            
        $residents = $query->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'purok' => ($user->residentProfile && $user->residentProfile->purok) ? $user->residentProfile->purok : 'All Puroks',
                    'status' => ($user->residentProfile && $user->residentProfile->verification_status) ? $user->residentProfile->verification_status : 'pending',
                    'avatar' => $user->profile_photo_path,
                ];
            });

        return response()->json($residents);
    }

    public function getStaff(Request $request)
    {
        $user = $request->user();
        
        $query = User::with(['role', 'staffProfile', 'responderProfile'])
            ->whereHas('role', function ($q) {
                $q->whereIn('slug', ['super-admin', 'barangay-admin', 'staff', 'responder']);
            });

        if ($user->barangay_id) {
            $query->where('barangay_id', $user->barangay_id);
        }
            
        $staff = $query->get()
            ->map(function ($user) {
                $department = 'Admin';
                if ($user->role->slug === 'responder' && $user->responderProfile) {
                    $department = 'Responder Unit';
                } elseif ($user->staffProfile) {
                    $department = $user->staffProfile->position ?? 'Staff';
                }

                return [
                    'id' => $user->id,
                    'name' => $user->first_name . ' ' . $user->last_name,
                    'email' => $user->email,
                    'role' => $user->role->name,
                    'department' => $department,
                    'status' => $user->is_active ? 'active' : 'inactive',
                    'avatar' => $user->profile_photo_path,
                ];
            });

        return response()->json($staff);
    }

    public function verifyQr(Request $request)
    {
        $request->validate([
            'qr_data' => 'required',
        ]);

        $qrData = $request->qr_data;

        // Try to decode if JSON
        if (is_string($qrData) && is_array(json_decode($qrData, true))) {
            $qrData = json_decode($qrData, true);
        }

        $userId = null;
        if (is_array($qrData) && isset($qrData['id'])) {
            $userId = $qrData['id'];
        } elseif (is_numeric($qrData)) {
            $userId = $qrData;
        }

        if (!$userId) {
            return response()->json(['message' => 'Invalid QR Code format.'], 400);
        }

        $resident = User::with(['role', 'residentProfile', 'barangay'])
            ->where('id', $userId)
            ->where('barangay_id', $request->user()->barangay_id)
            ->first();

        if (!$resident) {
            return response()->json(['message' => 'Resident not found or does not belong to your barangay.'], 404);
        }

        // Format response
        $residentData = [
            'id' => $resident->id,
            'first_name' => $resident->first_name,
            'last_name' => $resident->last_name,
            'profile_photo_path' => $resident->profile_photo_path,
            'role' => $resident->role,
            'profile' => [
                'address' => $resident->residentProfile->address ?? 'Not provided',
                'contact_number' => $resident->residentProfile->contact_number ?? 'Not provided',
                'purok' => $resident->residentProfile->purok ?? 'Not provided'
            ]
        ];

        return response()->json(['resident' => $residentData]);
    }
}
