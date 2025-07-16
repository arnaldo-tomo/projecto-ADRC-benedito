@extends('layouts.admin')

@section('title', 'Chat - AdRC Admin')
@section('page-title', 'Chat com Usuários')

@section('content')
    <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
            <div class="mb-6">
                <h3 class="text-lg font-medium text-gray-900">Conversas Ativas</h3>
                <p class="text-sm text-gray-500">Clique em uma conversa para responder às mensagens dos usuários</p>
            </div>

            <!-- Search Bar -->
            <div class="mb-6">
                <div class="relative">
                    <input type="text"
                           class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                           placeholder="Buscar por nome ou email do usuário..."
                           id="search-conversations">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i data-lucide="search" class="h-5 w-5 text-gray-400"></i>
                    </div>
                </div>
            </div>

            <!-- Conversations List -->
            <div class="space-y-4">
                @forelse($conversations as $conversation)
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

                                <!-- User Info -->
                                <div class="ml-4 flex-1">
                                    <div class="flex items-center justify-between">
                                        <h4 class="text-sm font-medium text-gray-900">{{ $conversation->name }}</h4>
                                        @if($conversation->chatMessages->count() > 0)
                                            <span class="text-xs text-gray-500">
                                                {{ $conversation->chatMessages->first()->created_at->format('d/m/Y H:i') }}
                                            </span>
                                        @endif
                                    </div>

                                    <p class="text-sm text-gray-500">{{ $conversation->email }}</p>

                                    @if($conversation->chatMessages->count() > 0)
                                        <div class="mt-1">
                                            <p class="text-xs text-gray-400 line-clamp-2">
                                                <span class="font-medium">
                                                    @if($conversation->chatMessages->first()->sender_type === 'admin')
                                                        Você:
                                                    @else
                                                        {{ $conversation->name }}:
                                                    @endif
                                                </span>
                                                {{ Str::limit($conversation->chatMessages->first()->message, 60) }}
                                            </p>
                                        </div>
                                    @endif

                                    <!-- Status Indicators -->
                                    <div class="flex items-center mt-2 space-x-2">
                                        @if($conversation->unread_messages_count > 0)
                                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                {{ $conversation->unread_messages_count }} nova{{ $conversation->unread_messages_count > 1 ? 's' : '' }}
                                            </span>
                                        @endif

                                        @if($conversation->last_active_at && $conversation->last_active_at->diffInMinutes() < 5)
                                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <span class="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></span>
                                                Online
                                            </span>
                                        @elseif($conversation->last_active_at)
                                            <span class="text-xs text-gray-500">
                                                Ativo {{ $conversation->last_active_at->diffForHumans() }}
                                            </span>
                                        @endif
                                    </div>
                                </div>
                            </div>

                            <!-- Action Button -->
                            <div class="flex items-center space-x-2 ml-4">
                                <button onclick="event.stopPropagation(); window.location.href='{{ route('admin.chat.show', $conversation) }}'"
                                        class="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors">
                                    <i data-lucide="message-circle" class="w-4 h-4 inline mr-1"></i>
                                    Responder
                                </button>
                            </div>
                        </div>
                    </div>
                @empty
                    <div class="text-center py-12">
                        <i data-lucide="message-circle" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhuma conversa ativa</h3>
                        <p class="text-gray-500 mb-4">Quando os usuários enviarem mensagens, elas aparecerão aqui.</p>
                        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                            <div class="flex">
                                <div class="flex-shrink-0">
                                    <i data-lucide="info" class="h-5 w-5 text-blue-400"></i>
                                </div>
                                <div class="ml-3">
                                    <h4 class="text-sm font-medium text-blue-800">Dica</h4>
                                    <p class="text-sm text-blue-700 mt-1">
                                        Os usuários podem iniciar conversas através do chat no aplicativo móvel.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                @endforelse
            </div>

            <!-- Pagination -->
            @if($conversations->hasPages())
                <div class="mt-6">
                    {{ $conversations->links() }}
                </div>
            @endif
        </div>
    </div>
@endsection

@push('scripts')
<script>
    // Search functionality
    document.getElementById('search-conversations').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const conversations = document.querySelectorAll('.conversation-item');

        conversations.forEach(conversation => {
            const text = conversation.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                conversation.style.display = 'block';
            } else {
                conversation.style.display = 'none';
            }
        });
    });

    // Auto-refresh every 30 seconds
    setInterval(() => {
        window.location.reload();
    }, 30000);
</script>
@endpush
