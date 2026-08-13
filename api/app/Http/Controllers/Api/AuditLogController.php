<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AuditLog;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $barangayId = $request->user()->barangay_id;
        
        $query = AuditLog::with("user:id,first_name,last_name,email");
            
        if ($barangayId) {
            $query->whereHas("user", function($q) use ($barangayId) {
                $q->where("barangay_id", $barangayId);
            });
        }

        if ($request->has("search")) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where("action", "like", "%{$search}%")
                  ->orWhere("module", "like", "%{$search}%")
                  ->orWhere("description", "like", "%{$search}%")
                  ->orWhereHas("user", function($u) use ($search) {
                      $u->where("first_name", "like", "%{$search}%")
                        ->orWhere("last_name", "like", "%{$search}%");
                  });
            });
        }

        $logs = $query->orderBy("created_at", "desc")->paginate(20);
        
        return response()->json($logs);
    }
}
