<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;

class AuditLogService
{
    public static function log($action, $module, $description, $recordId = null)
    {
        try {
            $user = Auth::guard('sanctum')->user() ?? Auth::user();
            if (!$user) return;

            AuditLog::create([
                'user_id' => $user->id,
                'action' => $action,
                'module' => $module,
                'record_id' => $recordId,
                'description' => $description,
                'ip_address' => request()->ip(),
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to create audit log: ' . $e->getMessage());
        }
    }
}
