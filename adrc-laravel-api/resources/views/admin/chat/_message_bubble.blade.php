{{-- resources/views/admin/chat/_message_bubble.blade.php --}}
<div class="flex {{ $message->sender_type === 'admin' ? 'justify-end' : 'justify-start' }}">
    <div class="max-w-xs lg:max-w-md">
        <!-- Message Header -->
        <div class="flex items-center {{ $message->sender_type === 'admin' ? 'flex-row-reverse' : 'flex-row' }} mb-1">
            <div class="flex-shrink-0">
                @if($message->sender_type === 'admin')
                    <div class="bg-red-600 rounded-full p-1">
                        <i data-lucide="shield" class="w-3 h-3 text-white"></i>
                    </div>
                @else
                    <div class="bg-blue-600 rounded-full p-1">
                        <i data-lucide="user" class="w-3 h-3 text-white"></i>
                    </div>
                @endif
            </div>
            <div class="mx-2">
                <span class="text-xs text-gray-500">
                    {{ $message->sender_type === 'admin' ? 'Admin' : $message->user->name }}
                </span>
            </div>
        </div>

        <!-- Message Bubble -->
        <div class="px-4 py-2 rounded-lg {{ $message->sender_type === 'admin' ? 'bg-red-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-900 rounded-bl-sm' }}">
            <p class="text-sm break-words">{{ $message->message }}</p>
        </div>

        <!-- Message Footer -->
        <div class="flex {{ $message->sender_type === 'admin' ? 'justify-end' : 'justify-start' }} mt-1">
            <div class="flex items-center space-x-1">
                <span class="text-xs text-gray-500">
                    {{ $message->created_at->format('H:i') }}
                </span>
                @if($message->sender_type === 'admin')
                    @if($message->is_read)
                        <i data-lucide="check-check" class="w-3 h-3 text-green-500" title="Lida"></i>
                    @else
                        <i data-lucide="check" class="w-3 h-3 text-gray-400" title="Enviada"></i>
                    @endif
                @endif
            </div>
        </div>
    </div>
</div>
