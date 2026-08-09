<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller
{
    public function uploadLogo(Request $request)
    {
        try {
            \Illuminate\Support\Facades\Log::info('Upload Request files: ', $_FILES);
            
            $request->validate([
                'logo' => 'required|image|mimes:jpeg,png,jpg,svg|max:5120'
            ]);

            $user = $request->user();
            \Illuminate\Support\Facades\Log::info('User role slug: ' . ($user->role ? $user->role->slug : 'null'));
            
            $barangay = $user->barangay;
            if (!$barangay) {
                return response()->json(['message' => 'No barangay associated with user'], 404);
            }

            // Delete old logo if exists (if it was a file)
            if ($barangay->logo_path && str_starts_with($barangay->logo_path, 'storage/')) {
                Storage::disk('public')->delete(str_replace('storage/', '', $barangay->logo_path));
            }

            $file = $request->file('logo');
            $base64 = base64_encode(file_get_contents($file->getRealPath()));
            $mime = $file->getMimeType();
            $dataUri = 'data:' . $mime . ';base64,' . $base64;
            
            $barangay->logo_path = $dataUri;
            $barangay->save();

            return response()->json([
                'message' => 'Logo uploaded successfully',
                'logo_path' => $barangay->logo_path,
                'barangay' => $barangay
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Illuminate\Support\Facades\Log::error('Validation error in uploadLogo: ' . json_encode($e->errors()));
            throw $e;
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Exception in uploadLogo: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function updateBarangay(Request $request)
    {
        $user = $request->user();
        \Illuminate\Support\Facades\Log::info('User role slug: ' . ($user->role ? $user->role->slug : 'null'));
        // if ($user->role->slug !== 'barangay-admin' && $user->role->slug !== 'super-admin') {
        //     return response()->json(['message' => 'Unauthorized'], 403);
        // }

        $barangay = $user->barangay;
        if (!$barangay) {
            return response()->json(['message' => 'No barangay associated with user'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'province' => 'required|string|max:255',
            'region' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'contact_number' => 'nullable|string|max:255',
            'address' => 'nullable|string',
        ]);

        $barangay->update($validated);

        return response()->json([
            'message' => 'Barangay details updated successfully',
            'barangay' => $barangay
        ]);
    }

    public function updateSecurity(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        $user->first_name = $validated['first_name'];
        $user->last_name = $validated['last_name'];
        $user->email = $validated['email'];
        
        if (!empty($validated['password'])) {
            $user->password = \Illuminate\Support\Facades\Hash::make($validated['password']);
        }

        $user->save();
        $user->load('barangay');

        return response()->json([
            'message' => 'Security settings updated successfully',
            'user' => $user
        ]);
    }
}
