{{-- resources/views/admin/chat/_conversation_item.blade.php --}}
<div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer conversation-item"
     onclick="window.location.href='{{ route('admin.chat.show', $conversation) }}'">
    <div class="flex items-center justify-between">
        <div class="flex items-center flex-1">
            <!-- User Avatar -->
            <div class="flex-shrink-0">
                <div class="bg-blue-600 rounded-full p-2 relative">
                    <i data-lucide="user" class="w-5 h-5 text-white"></i>
                    @if($conversation->unread_messages_count > 0)
                        <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {{ $conversation->unread_messages_count > 9 ? '9+' : $conversation->unread_messages_count }}
                        </span>
                    @endif
                </div>
            </div>

            <!-- Conversation Details -->
            <div class="ml-4 flex-1">
                <div class="flex items-center justify-between">
                    <h4 class="text-sm font-medium text-gray-900">{{ $conversation->name }}</h4>
                    @if($conversation->chatMessages->count() > 0)
                        <span class="text-xs text-gray-500">
                            {{ $conversation->chatMessages->first()->created_at->format('H:i') }}
                        </span>
                    @endif
                </div>

                <p class="text-sm text-gray-500">{{ $conversation->email }}</p>

                @if($conversation->chatMessages->count() > 0)
                    <p class="text-xs text-gray-400 mt-1 line-clamp-1">
                        <span class="font-medium">
                            @if($conversation->chatMessages->first()->sender_type === 'admin')
                                Você:
                            @else
                                {{ $conversation->name }}:
                            @endif
                        </span>
                        {{ Str::limit($conversation->chatMessages->first()->message, 40) }}
                    </p>
                @endif

                <!-- Status Indicators -->
                <div class="flex items-center mt-2 space-x-2">
                    @if($conversation->unread_messages_count > 0)
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {{ $conversation->unread_messages_count }} nova{{ $conversation->unread_messages_count > 1 ? 's' : '' }}
                        </span>
                    @endif

                    @if($conversation->last_active_at && $conversation->last_active_at->diffInMinutes() < 5)
                        <span class="inline-flex items-center text-green-600 text-xs">
                            <span class="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></span>
                            Online
                        </span>
                    @endif
                </div>
            </div>
        </div>

        <!-- Action Button -->
        <div class="ml-4">
            <button onclick="event.stopPropagation(); window.location.href='{{ route('admin.chat.show', $conversation) }}'"
                    class="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors">
                <i data-lucide="message-circle" class="w-4 h-4 inline mr-1"></i>
                Chat
            </button>
        </div>
    </div>
</div>
