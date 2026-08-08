<?php

$controllersDir = __DIR__ . '/app/Http/Controllers/Api';
if (!is_dir($controllersDir)) {
    mkdir($controllersDir, 0755, true);
}

$controllers = [
    'AuthController' => <<<PHP
<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request \$request)
    {
        \$request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt(\$request->only('email', 'password'))) {
            \$user = Auth::user();
            if (!\$user->is_active) {
                return response()->json(['message' => 'Account is deactivated.'], 403);
            }
            \$token = \$user->createToken('auth_token')->plainTextToken;
            \$user->load('role', 'barangay');
            return response()->json(['token' => \$token, 'user' => \$user]);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    public function logout(Request \$request)
    {
        \$request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }

    public function user(Request \$request)
    {
        \$user = \$request->user()->load('role', 'barangay', 'residentProfile', 'staffProfile', 'responderProfile');
        return response()->json(\$user);
    }
}
PHP,
    'DashboardController' => <<<PHP
<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Report;
use App\Models\ServiceRequest;
use App\Models\EmergencyReport;

class DashboardController extends Controller
{
    public function adminDashboard(Request \$request)
    {
        \$barangayId = \$request->user()->barangay_id;
        \$query = function (\$q) use (\$barangayId) {
            if (\$barangayId) \$q->where('barangay_id', \$barangayId);
        };

        return response()->json([
            'total_reports' => Report::where(\$query)->count(),
            'pending_requests' => ServiceRequest::where(\$query)->whereIn('status', ['SUBMITTED', 'UNDER REVIEW'])->count(),
            'active_emergencies' => EmergencyReport::where(\$query)->whereNotIn('status', ['RESOLVED', 'CLOSED', 'FALSE ALARM'])->count(),
            'resolved_reports' => Report::where(\$query)->whereIn('status', ['RESOLVED', 'CLOSED'])->count(),
        ]);
    }
}
PHP,
    'ReportController' => <<<PHP
<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Report;

class ReportController extends Controller
{
    public function index(Request \$request)
    {
        \$user = \$request->user();
        \$query = Report::with('category', 'user');
        
        if (\$user->role->slug === 'resident') {
            \$query->where('user_id', \$user->id);
        } else if (\$user->barangay_id) {
            \$query->where('barangay_id', \$user->barangay_id);
        }
        
        return response()->json(\$query->latest()->get());
    }

    public function store(Request \$request)
    {
        \$validated = \$request->validate([
            'category_id' => 'required|exists:report_categories,id',
            'title' => 'required|string',
            'description' => 'required|string',
            'address' => 'required|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);
        
        \$user = \$request->user();
        \$validated['user_id'] = \$user->id;
        \$validated['barangay_id'] = \$user->barangay_id ?: 1;
        \$validated['status'] = 'SUBMITTED';

        \$report = Report::create(\$validated);
        
        return response()->json(\$report, 201);
    }
    
    public function show(Report \$report)
    {
        return response()->json(\$report->load('category', 'user', 'statusHistories', 'assignments.responder'));
    }
    
    public function updateStatus(Request \$request, Report \$report)
    {
        \$validated = \$request->validate([
            'status' => 'required|string',
            'remarks' => 'nullable|string'
        ]);
        
        \$report->update(['status' => \$validated['status']]);
        \$report->statusHistories()->create([
            'user_id' => \$request->user()->id,
            'status' => \$validated['status'],
            'remarks' => \$validated['remarks']
        ]);
        
        return response()->json(\$report);
    }
}
PHP,
    'ServiceRequestController' => <<<PHP
<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ServiceRequest;

class ServiceRequestController extends Controller
{
    public function index(Request \$request)
    {
        \$user = \$request->user();
        \$query = ServiceRequest::with('serviceType', 'user');
        
        if (\$user->role->slug === 'resident') {
            \$query->where('user_id', \$user->id);
        } else if (\$user->barangay_id) {
            \$query->where('barangay_id', \$user->barangay_id);
        }
        
        return response()->json(\$query->latest()->get());
    }
    
    public function store(Request \$request)
    {
        \$validated = \$request->validate([
            'service_type_id' => 'required|exists:service_types,id',
            'remarks' => 'nullable|string',
        ]);
        
        \$user = \$request->user();
        \$validated['user_id'] = \$user->id;
        \$validated['barangay_id'] = \$user->barangay_id ?: 1;
        \$validated['status'] = 'SUBMITTED';

        \$request = ServiceRequest::create(\$validated);
        
        return response()->json(\$request, 201);
    }
}
PHP,
    'EmergencyController' => <<<PHP
<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\EmergencyReport;

class EmergencyController extends Controller
{
    public function index(Request \$request)
    {
        \$user = \$request->user();
        \$query = EmergencyReport::with('category', 'user');
        
        if (\$user->role->slug === 'resident') {
            \$query->where('user_id', \$user->id);
        } else if (\$user->barangay_id) {
            \$query->where('barangay_id', \$user->barangay_id);
        }
        
        return response()->json(\$query->latest()->get());
    }
    
    public function store(Request \$request)
    {
        \$validated = \$request->validate([
            'category_id' => 'required|exists:emergency_categories,id',
            'contact_name' => 'required|string',
            'contact_phone' => 'required|string',
            'address' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'description' => 'nullable|string',
        ]);
        
        \$user = \$request->user();
        \$validated['user_id'] = \$user->id;
        \$validated['barangay_id'] = \$user->barangay_id ?: 1;
        \$validated['status'] = 'REPORTED';

        \$emergency = EmergencyReport::create(\$validated);
        
        return response()->json(\$emergency, 201);
    }
}
PHP,
    'AnnouncementController' => <<<PHP
<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Announcement;

class AnnouncementController extends Controller
{
    public function index(Request \$request)
    {
        \$user = \$request->user();
        \$query = Announcement::with('author');
        
        if (\$user->barangay_id) {
            \$query->where('barangay_id', \$user->barangay_id);
        }
        
        return response()->json(\$query->latest()->get());
    }
}
PHP,
    'CategoryController' => <<<PHP
<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\ReportCategory;
use App\Models\ServiceType;
use App\Models\EmergencyCategory;

class CategoryController extends Controller
{
    public function getCategories()
    {
        return response()->json([
            'reports' => ReportCategory::where('is_active', true)->get(),
            'services' => ServiceType::where('is_active', true)->get(),
            'emergencies' => EmergencyCategory::where('is_active', true)->get(),
        ]);
    }
}
PHP,
];

foreach ($controllers as $name => $content) {
    file_put_contents($controllersDir . '/' . $name . '.php', $content);
}

// Write Routes
$routesFile = __DIR__ . '/routes/api.php';
$routesContent = <<<PHP
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\ServiceRequestController;
use App\Http\Controllers\Api\EmergencyController;
use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\CategoryController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    Route::get('/dashboard', [DashboardController::class, 'adminDashboard']);
    
    Route::apiResource('reports', ReportController::class);
    Route::put('/reports/{report}/status', [ReportController::class, 'updateStatus']);
    
    Route::apiResource('service-requests', ServiceRequestController::class);
    Route::apiResource('emergencies', EmergencyController::class);
    Route::apiResource('announcements', AnnouncementController::class);
    
    Route::get('/categories', [CategoryController::class, 'getCategories']);
});
PHP;
file_put_contents($routesFile, $routesContent);

// Default Seeders for Categories
$categorySeederFile = __DIR__ . '/database/seeders/CategorySeeder.php';
$categorySeederContent = <<<PHP
<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\ReportCategory;
use App\Models\ServiceType;
use App\Models\EmergencyCategory;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        \$reportCats = ['Road damage', 'Flooding', 'Garbage problems', 'Broken streetlights', 'Water problems', 'Public safety', 'Noise complaints'];
        foreach (\$reportCats as \$c) ReportCategory::firstOrCreate(['name' => \$c]);

        \$services = ['Barangay clearance', 'Certificate of residency', 'Certificate of indigency', 'Business permit clearance'];
        foreach (\$services as \$s) ServiceType::firstOrCreate(['name' => \$s]);

        \$emergencies = ['Fire', 'Medical emergency', 'Accident', 'Flood', 'Crime', 'Other'];
        foreach (\$emergencies as \$e) EmergencyCategory::firstOrCreate(['name' => \$e]);
    }
}
PHP;
file_put_contents($categorySeederFile, $categorySeederContent);

echo "Controllers and Routes generated successfully.\n";
