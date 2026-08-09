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
Route::post('/register', [AuthController::class, 'register']);
Route::get('/barangays', [AuthController::class, 'getBarangays']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    Route::get('/dashboard', [DashboardController::class, 'adminDashboard']);
    Route::get('/map-data', [\App\Http\Controllers\Api\MapController::class, 'getMapData']);
    Route::get('/audit-logs', [\App\Http\Controllers\Api\AuditLogController::class, 'index']);
    Route::get('/notifications/unread-count', [DashboardController::class, 'getUnreadCounts']);
    
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::post('/user/profile/avatar', [AuthController::class, 'uploadAvatar']);
    
    Route::apiResource('reports', ReportController::class);
    Route::put('/reports/{report}/status', [ReportController::class, 'updateStatus']);
    
    Route::apiResource('service-requests', ServiceRequestController::class);
    Route::apiResource('emergencies', EmergencyController::class);
    Route::apiResource('announcements', AnnouncementController::class);
    Route::apiResource('documents', \App\Http\Controllers\Api\DocumentController::class);
    
    Route::get('/categories', [CategoryController::class, 'getCategories']);
    
    Route::get('/user/notifications', [\App\Http\Controllers\Api\NotificationController::class, 'index']);
    Route::get('/user/notifications/unread-count', [\App\Http\Controllers\Api\NotificationController::class, 'unreadCount']);
    Route::put('/user/notifications/{id}/read', [\App\Http\Controllers\Api\NotificationController::class, 'markAsRead']);
    Route::put('/user/notifications/read-all', [\App\Http\Controllers\Api\NotificationController::class, 'markAllAsRead']);
    
    Route::post('/settings/logo', [\App\Http\Controllers\Api\SettingsController::class, 'uploadLogo']);
    Route::put('/settings/barangay', [\App\Http\Controllers\Api\SettingsController::class, 'updateBarangay']);
    Route::put('/settings/security', [\App\Http\Controllers\Api\SettingsController::class, 'updateSecurity']);

    // New routes
    Route::get('/users/residents', [\App\Http\Controllers\Api\UserController::class, 'getResidents']);
    Route::get('/users/staff', [\App\Http\Controllers\Api\UserController::class, 'getStaff']);
    Route::apiResource('events', \App\Http\Controllers\Api\EventController::class)->except(['create', 'edit', 'show', 'update']);
    Route::get('/messages', [\App\Http\Controllers\Api\MessageController::class, 'getConversations']);
    Route::get('/messages/{userId}', [\App\Http\Controllers\Api\MessageController::class, 'getMessages']);
    Route::post('/messages', [\App\Http\Controllers\Api\MessageController::class, 'sendMessage']);
    Route::post('/broadcast', [\App\Http\Controllers\Api\BroadcastController::class, 'sendBroadcast']);
});