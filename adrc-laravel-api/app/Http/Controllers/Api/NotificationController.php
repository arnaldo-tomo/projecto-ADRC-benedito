<?php

// app/Http/Controllers/Api/NotificationController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\UserNotification;
use Illuminate\Http\Request;
use Carbon\Carbon;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Buscar notificações do usuário com informações de leitura
        $userNotifications = UserNotification::where('user_id', $user->id)
            ->with('notification')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        // Formatar dados para o frontend
        $formattedNotifications = $userNotifications->map(function ($userNotification) {
            $notification = $userNotification->notification;
            return [
                'id' => $notification->id,
                'title' => $notification->title,
                'message' => $notification->message,
                'type' => $notification->type,
                'type_text' => $notification->type_text,
                'created_at' => $notification->created_at->toISOString(),
                'is_read' => $userNotification->is_read,
                'read_at' => $userNotification->read_at?->toISOString(),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'data' => $formattedNotifications,
                'current_page' => $userNotifications->currentPage(),
                'last_page' => $userNotifications->lastPage(),
                'per_page' => $userNotifications->perPage(),
                'total' => $userNotifications->total(),
            ]
        ]);
    }

    /**
     * Buscar notificações novas (criadas após timestamp)
     */
    public function getNewNotifications(Request $request)
    {
        $afterTimestamp = $request->query('after');

        if (!$afterTimestamp) {
            return response()->json([
                'success' => true,
                'data' => []
            ]);
        }

        try {
            $afterDate = Carbon::parse($afterTimestamp);
            $user = $request->user();

            // Buscar notificações enviadas após o timestamp
            $newNotifications = Notification::where('created_at', '>', $afterDate)
                ->whereNotNull('sent_at') // Apenas notificações já enviadas
                ->orderBy('created_at', 'desc')
                ->get();

            $newNotificationsData = [];

            foreach ($newNotifications as $notification) {
                // Verificar se usuário já tem registro desta notificação
                $userNotification = UserNotification::where('user_id', $user->id)
                    ->where('notification_id', $notification->id)
                    ->first();

                if (!$userNotification) {
                    // Criar registro para o usuário
                    $userNotification = UserNotification::create([
                        'user_id' => $user->id,
                        'notification_id' => $notification->id,
                        'is_read' => false
                    ]);

                    // Adicionar à lista de notificações novas
                    $newNotificationsData[] = [
                        'id' => $notification->id,
                        'title' => $notification->title,
                        'message' => $notification->message,
                        'type' => $notification->type,
                        'type_text' => $notification->type_text,
                        'created_at' => $notification->created_at->toISOString(),
                        'is_read' => false
                    ];
                }
            }

            return response()->json([
                'success' => true,
                'data' => $newNotificationsData
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao verificar novas notificações',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function markAsRead(Request $request, Notification $notification)
    {
        $userNotification = UserNotification::where('user_id', $request->user()->id)
            ->where('notification_id', $notification->id)
            ->first();

        if (!$userNotification) {
            return response()->json([
                'success' => false,
                'message' => 'Notificação não encontrada'
            ], 404);
        }

        $userNotification->update([
            'is_read' => true,
            'read_at' => now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Notificação marcada como lida'
        ]);
    }

    public function markAllAsRead(Request $request)
    {
        UserNotification::where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now()
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Todas as notificações marcadas como lidas'
        ]);
    }

    public function unreadCount(Request $request)
    {
        $count = UserNotification::where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->count();

        return response()->json([
            'success' => true,
            'data' => ['count' => $count]
        ]);
    }
}
