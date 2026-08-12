<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;
use App\Models\ResidentProfile;
use App\Models\Barangay;
use Illuminate\Support\Facades\Mail;
use App\Mail\WelcomeEmail;

class AuthController extends Controller
{
    public function getBarangays()
    {
        return response()->json(Barangay::all(['id', 'name']));
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user && Hash::check($request->password, $user->password)) {
            if (!$user->is_active) {
                return response()->json(['message' => 'Account is deactivated.'], 403);
            }
            $token = $user->createToken('auth_token')->plainTextToken;
            $user->load('role', 'barangay');
            return response()->json(['token' => $token, 'user' => $user]);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            'barangay_id' => 'required|exists:barangays,id',
        ]);

        $residentRole = Role::where('slug', 'resident')->first();

        $user = User::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role_id' => $residentRole->id,
            'barangay_id' => $validated['barangay_id'],
            'is_active' => true,
        ]);

        // Create empty profile
        ResidentProfile::create([
            'user_id' => $user->id,
            'address' => 'Not Provided',
        ]);

        // Send Welcome Email
        try {
            Mail::to($user->email)->send(new WelcomeEmail($user));
        } catch (\Exception $e) {
            \Log::error('Failed to send welcome email: ' . $e->getMessage());
        }

        $token = $user->createToken('auth_token')->plainTextToken;
        $user->load('role', 'barangay');
        
        return response()->json(['token' => $token, 'user' => $user], 201);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }

    public function user(Request $request)
    {
        $user = $request->user()->load('role', 'barangay', 'residentProfile', 'staffProfile', 'responderProfile');
        // Standardize profile relation for frontend (which uses user.profile)
        $user->profile = $user->residentProfile ?? $user->staffProfile ?? $user->responderProfile;
        return response()->json($user);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'contact_number' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        if ($user->residentProfile) {
            $user->residentProfile->update($validated);
        }

        return response()->json(['message' => 'Profile updated successfully']);
    }

    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|string'
        ]);

        $user = $request->user();
        
        // The frontend will send the compressed base64 string directly
        $user->profile_photo_path = $request->avatar;
        $user->save();

        return response()->json([
            'message' => 'Avatar updated successfully',
            'avatar_url' => $user->profile_photo_path
        ]);
    }
}