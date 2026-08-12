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
        $barangayId = $request->user()->barangay_id;
        
        $residents = User::with(['residentProfile', 'role'])
            ->where('barangay_id', $barangayId)
            ->whereHas('role', function ($query) {
                $query->where('slug', 'resident');
            })
            ->get()
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
        $barangayId = $request->user()->barangay_id;
        
        $staff = User::with(['role', 'staffProfile', 'responderProfile'])
            ->where('barangay_id', $barangayId)
            ->whereHas('role', function ($query) {
                $query->whereIn('slug', ['super-admin', 'barangay-admin', 'staff', 'responder']);
            })
            ->get()
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
}
