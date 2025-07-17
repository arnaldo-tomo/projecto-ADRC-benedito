<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChatMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ChatController extends Controller
{
    /**
     * Get all chat messages for the authenticated user
     */
    public function getMessages()
    {
        try {
            $user = Auth::user();

            // Buscar mensagens do usuário e mensagens de admin para este usuário
            $messages = ChatMessage::where(function ($query) use ($user) {
                $query->where('user_id', $user->id)
                      ->orWhere('sender_type', 'admin'); // Admin messages são globais ou você pode filtrar por contexto
            })
            ->with(['user:id,name,email'])
            ->orderBy('created_at', 'asc')
            ->get();

            return response()->json([
                'success' => true,
                'data' => $messages
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar mensagens'
            ], 500);
        }
    }

    /**
     * Send a new message
     */
    public function sendMessage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'message' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = Auth::user();

            $chatMessage = ChatMessage::create([
                'user_id' => $user->id,
                'message' => $request->message,
                'sender_type' => 'user',
                'is_read' => false,
            ]);

            // Load user relationship
            $chatMessage->load('user:id,name,email');

            // Aqui você pode adicionar lógica para notificar admins
            // Por exemplo, enviar notificação push, email, etc.
            // $this->notifyAdmins($chatMessage);

            return response()->json([
                'success' => true,
                'data' => $chatMessage,
                'message' => 'Mensagem enviada com sucesso'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao enviar mensagem'
            ], 500);
        }
    }

    /**
     * Mark messages as read for the current user
     */
    public function markAsRead()
    {
        try {
            $user = Auth::user();

            // Marcar mensagens de admin como lidas pelo usuário atual
            // Como não temos receiver_id, vamos usar uma abordagem diferente
            // Você pode implementar uma tabela pivot ou usar outra estratégia

            // Por enquanto, vamos marcar todas as mensagens de admin como lidas
            ChatMessage::fromAdmin()
                ->where('is_read', false)
                ->update([
                    'is_read' => true,
                    'read_at' => now()
                ]);

            return response()->json([
                'success' => true,
                'message' => 'Mensagens marcadas como lidas'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao marcar mensagens como lidas'
            ], 500);
        }
    }

    /**
     * Get unread messages count for current user
     */
    public function getUnreadCount()
    {
        try {
            $user = Auth::user();

            // Contar mensagens de admin não lidas
            $count = ChatMessage::fromAdmin()
                ->unread()
                ->count();

            return response()->json([
                'success' => true,
                'data' => ['count' => $count]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar contagem'
            ], 500);
        }
    }

    /**
     * Admin method to send reply
     */
    public function sendAdminReply(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'message' => 'required|string|max:1000',
            'user_id' => 'nullable|exists:users,id', // Opcional para resposta geral
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $chatMessage = ChatMessage::create([
                'user_id' => $request->user_id, // null para mensagem geral, ou ID específico
                'message' => $request->message,
                'sender_type' => 'admin',
                'is_read' => false,
            ]);

            // Aqui você pode adicionar lógica para notificar o usuário específico
            // $this->notifyUser($chatMessage, $request->user_id);

            return response()->json([
                'success' => true,
                'data' => $chatMessage,
                'message' => 'Resposta enviada com sucesso'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao enviar resposta'
            ], 500);
        }
    }

    /**
     * Get chat conversations for admin (grouped by user)
     */
    public function getConversations()
    {
        try {
            // Buscar usuários que enviaram mensagens
            $conversations = ChatMessage::fromUser()
                ->with(['user:id,name,email,phone'])
                ->select('user_id')
                ->selectRaw('MAX(created_at) as last_message_at')
                ->selectRaw('COUNT(*) as total_messages')
                ->groupBy('user_id')
                ->orderBy('last_message_at', 'desc')
                ->get()
                ->map(function ($conversation) {
                    // Buscar última mensagem para cada usuário
                    $lastMessage = ChatMessage::byUser($conversation->user_id)
                        ->orderBy('created_at', 'desc')
                        ->first();

                    // Contar mensagens não lidas do usuário
                    $unreadCount = ChatMessage::byUser($conversation->user_id)
                        ->fromUser()
                        ->unread()
                        ->count();

                    $conversation->last_message = $lastMessage;
                    $conversation->unread_messages_count = $unreadCount;

                    return $conversation;
                });

            return response()->json([
                'success' => true,
                'data' => $conversations
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar conversas'
            ], 500);
        }
    }

    /**
     * Get conversation messages for specific user
     */
    public function getConversationMessages($userId)
    {
        try {
            $messages = ChatMessage::where(function ($query) use ($userId) {
                $query->where('user_id', $userId)
                      ->orWhere(function ($q) use ($userId) {
                          $q->where('sender_type', 'admin')
                            ->where(function ($subQ) use ($userId) {
                                $subQ->where('user_id', $userId)
                                     ->orWhereNull('user_id'); // Mensagens gerais de admin
                            });
                      });
            })
            ->with(['user:id,name,email'])
            ->orderBy('created_at', 'asc')
            ->get();

            // Marcar mensagens do usuário como lidas quando admin abre a conversa
            ChatMessage::byUser($userId)
                ->fromUser()
                ->unread()
                ->update([
                    'is_read' => true,
                    'read_at' => now()
                ]);

            return response()->json([
                'success' => true,
                'data' => $messages
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar mensagens da conversa'
            ], 500);
        }
    }

    /**
     * Delete a message (admin only)
     */
    public function deleteMessage($messageId)
    {
        try {
            $message = ChatMessage::findOrFail($messageId);
            $message->delete();

            return response()->json([
                'success' => true,
                'message' => 'Mensagem excluída com sucesso'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao excluir mensagem'
            ], 500);
        }
    }

    /**
     * Get chat statistics for admin
     */
    public function getStatistics()
    {
        try {
            $stats = [
                'total_messages' => ChatMessage::count(),
                'total_users_with_messages' => ChatMessage::fromUser()->distinct('user_id')->count(),
                'unread_messages' => ChatMessage::fromUser()->unread()->count(),
                'messages_today' => ChatMessage::whereDate('created_at', today())->count(),
                'messages_this_week' => ChatMessage::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar estatísticas'
            ], 500);
        }
    }

    // Métodos auxiliares privados

    /**
     * Notify admins about new user message
     */
    private function notifyAdmins($message)
    {
        // Implementar notificação para admins
        // Exemplo: enviar email, push notification, etc.
    }

    /**
     * Notify user about admin reply
     */
    private function notifyUser($message, $userId)
    {
        // Implementar notificação para usuário específico
        // Exemplo: enviar push notification, email, etc.
    }
}
