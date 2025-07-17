<?php


// routes/api.php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ChatController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // Reports routes
    Route::apiResource('reports', ReportController::class);

    // Notifications routes
    // Route::get('/notifications', [NotificationController::class, 'index']);
    // Route::post('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
    // Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    // Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);


 // Notificações
 Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/new', [NotificationController::class, 'getNewNotifications']);
    Route::post('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    // Route::get('/chat/messages', [ChatController::class, 'index']);
    // Route::post('/chat/messages', [ChatController::class, 'store']);
    // Route::post('/chat/messages/read', [ChatController::class, 'markAsRead']);
    // Route::get('/chat/messages/unread-count', [ChatController::class, 'unreadCount']);
      // Chat routes for users
    Route::prefix('chat')->group(function () {
        Route::get('/messages', [ChatController::class, 'getMessages']);
        Route::post('/messages', [ChatController::class, 'sendMessage']);
        Route::post('/messages/read', [ChatController::class, 'markAsRead']);
        Route::get('/messages/unread-count', [ChatController::class, 'getUnreadCount']);
    });
});
