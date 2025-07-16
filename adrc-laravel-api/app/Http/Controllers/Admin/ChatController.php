<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ChatController extends Controller
{
    public function index()
    {
        $conversations = User::where('role', 'user')
            ->whereHas('chatMessages')
            ->withCount(['chatMessages as unread_messages_count' => function($query) {
                $query->where('sender_type', 'user')->where('is_read', false);
            }])
            ->with(['chatMessages' => function($query) {
                $query->orderBy('created_at', 'desc')->limit(1);
            }])
            ->orderByDesc('last_active_at')
            ->paginate(20);

        return view('admin.chat.index', compact('conversations'));
    }

    public function show(User $user)
    {
        $messages = ChatMessage::where('user_id', $user->id)
            ->orderBy('created_at', 'asc')
            ->get();

        // Mark all user messages as read
        ChatMessage::where('user_id', $user->id)
            ->where('sender_type', 'user')
            ->where('is_read', false)
            ->update(['is_read' => true, 'read_at' => now()]);

        return view('admin.chat.show', compact('user', 'messages'));
    }

    public function sendMessage(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'message' => ['required', 'string', 'max:1000'],
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        ChatMessage::create([
            'user_id' => $user->id,
            'message' => $request->message,
            'sender_type' => 'admin',
        ]);

        return redirect()
            ->route('admin.chat.show', $user)
            ->with('success', 'Mensagem enviada com sucesso!');
    }
}
