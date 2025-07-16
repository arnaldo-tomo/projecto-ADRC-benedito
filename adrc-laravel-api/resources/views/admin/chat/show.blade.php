
{{-- resources/views/admin/chat/show.blade.php --}}
@extends('layouts.admin')

@section('title', 'Chat com ' . $user->name . ' - AdRC Admin')
@section('page-title', 'Chat com ' . $user->name)

@section('page-actions')
    <div class="flex space-x-2">
        <a href="{{ route('admin.users.show', $user) }}"
           class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
            <i data-lucide="user" class="w-4 h-4 inline mr-2"></i>
            Ver Perfil
        </a>
        <a href="{{ route('admin.chat.index') }}"
           class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            <i data-lucide="arrow-left" class="w-4 h-4 inline mr-2"></i>
            Voltar
        </a>
    </div>
@endsection

@section('content')
    <div class="bg-white shadow rounded-lg overflow-hidden">
        <!-- Chat Header -->
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <div class="bg-blue-600 rounded-full p-2">
                        <i data-lucide="user" class="w-6 h-6 text-white"></i>
                    </div>
                    <div class="ml-4">
                        <h3 class="text-lg font-medium text-gray-900">{{ $user->name }}</h3>
                        <div class="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{{ $user->email }}</span>
                            <span>{{ $user->phone }}</span>
                            @if($user->last_active_at && $user->last_active_at->diffInMinutes() < 5)
                                <span class="inline-flex items-center text-green-600">
                                    <span class="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                                    Online
                                </span>
                            @elseif($user->last_active_at)
                                <span>Ativo {{ $user->last_active_at->diffForHumans() }}</span>
                            @endif
                        </div>
                    </div>
                </div>

                <!-- Chat Actions -->
                <div class="flex items-center space-x-2">
                    <button onclick="clearChat()"
                            class="text-gray-400 hover:text-gray-500 transition-colors"
                            title="Limpar conversa">
                        <i data-lucide="trash-2" class="w-5 h-5"></i>
                    </button>
                    <button onclick="refreshMessages()"
                            class="text-gray-400 hover:text-gray-500 transition-colors"
                            title="Atualizar mensagens">
                        <i data-lucide="refresh-cw" class="w-5 h-5"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Messages Container -->
        <div class="flex flex-col h-96">
            <!-- Messages -->
            <div class="flex-1 overflow-y-auto p-4 space-y-4" id="messages-container">
                @forelse($messages as $message)
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
                                        {{ $message->sender_type === 'admin' ? 'Admin' : $user->name }}
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
                                        {{ $message->created_at->format('d/m/Y H:i') }}
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
                @empty
                    <div class="text-center py-8">
                        <i data-lucide="message-circle" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
                        <p class="text-gray-500">Nenhuma mensagem ainda. Inicie a conversa!</p>
                    </div>
                @endforelse
            </div>

            <!-- Message Input -->
            <div class="border-t border-gray-200 p-4 bg-gray-50">
                <form method="POST" action="{{ route('admin.chat.send', $user) }}" class="flex space-x-4" id="message-form">
                    @csrf
                    <div class="flex-1">
                        <label for="message" class="sr-only">Mensagem</label>
                        <textarea name="message"
                                  id="message"
                                  rows="2"
                                  required
                                  maxlength="1000"
                                  class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-none"
                                  placeholder="Digite sua mensagem..."></textarea>
                        <div class="flex justify-between items-center mt-1">
                            <span class="text-xs text-gray-500">
                                <span id="char-count">0</span>/1000 caracteres
                            </span>
                            <div class="flex items-center space-x-2">
                                <button type="button"
                                        onclick="insertTemplate('greeting')"
                                        class="text-xs text-blue-600 hover:text-blue-800"
                                        title="Inserir saudação">
                                    Saudação
                                </button>
                                <button type="button"
                                        onclick="insertTemplate('closing')"
                                        class="text-xs text-blue-600 hover:text-blue-800"
                                        title="Inserir despedida">
                                    Despedida
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="flex-shrink-0 flex flex-col justify-end">
                        <button type="submit"
                                class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                                id="send-button">
                            <i data-lucide="send" class="w-4 h-4"></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Quick Actions Panel -->
    <div class="mt-6 bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h3>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- User Reports -->
                <div class="bg-blue-50 rounded-lg p-4">
                    <div class="flex items-center">
                        <i data-lucide="file-text" class="w-5 h-5 text-blue-600"></i>
                        <h4 class="ml-2 text-sm font-medium text-blue-900">Ocorrências</h4>
                    </div>
                    <p class="mt-1 text-2xl font-bold text-blue-600">{{ $user->reports->count() }}</p>
                    <a href="{{ route('admin.users.show', $user) }}" class="text-sm text-blue-600 hover:text-blue-800">
                        Ver todas →
                    </a>
                </div>

                <!-- Recent Activity -->
                <div class="bg-green-50 rounded-lg p-4">
                    <div class="flex items-center">
                        <i data-lucide="activity" class="w-5 h-5 text-green-600"></i>
                        <h4 class="ml-2 text-sm font-medium text-green-900">Última Atividade</h4>
                    </div>
                    <p class="mt-1 text-sm text-green-600">
                        {{ $user->last_active_at ? $user->last_active_at->diffForHumans() : 'Nunca' }}
                    </p>
                </div>

                <!-- Send Notification -->
                <div class="bg-yellow-50 rounded-lg p-4">
                    <div class="flex items-center">
                        <i data-lucide="bell" class="w-5 h-5 text-yellow-600"></i>
                        <h4 class="ml-2 text-sm font-medium text-yellow-900">Notificar</h4>
                    </div>
                    <button onclick="sendNotification()"
                            class="mt-2 text-sm text-yellow-600 hover:text-yellow-800">
                        Enviar notificação →
                    </button>
                </div>
            </div>
        </div>
    </div>
@endsection

@push('scripts')
<script>
    // Auto-scroll to bottom
    function scrollToBottom() {
        const container = document.getElementById('messages-container');
        container.scrollTop = container.scrollHeight;
    }

    // Character counter
    const messageInput = document.getElementById('message');
    const charCount = document.getElementById('char-count');

    messageInput.addEventListener('input', function() {
        charCount.textContent = this.value.length;
    });

    // Auto-resize textarea
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });

    // Form submission
    document.getElementById('message-form').addEventListener('submit', function(e) {
        const button = document.getElementById('send-button');
        const input = document.getElementById('message');

        if (!input.value.trim()) {
            e.preventDefault();
            return;
        }

        button.disabled = true;
        button.innerHTML = '<i data-lucide="loader" class="w-4 h-4 animate-spin"></i>';
    });

    // Insert message templates
    function insertTemplate(type) {
        const input = document.getElementById('message');
        const templates = {
            greeting: 'Olá! Como posso ajudá-lo hoje?',
            closing: 'Obrigado por entrar em contato. Estamos sempre à disposição!'
        };

        input.value = templates[type] || '';
        input.focus();
        charCount.textContent = input.value.length;
    }

    // Refresh messages
    function refreshMessages() {
        window.location.reload();
    }

    // Clear chat (admin only)
    function clearChat() {
        if (confirm('Tem certeza que deseja limpar esta conversa? Esta ação não pode ser desfeita.')) {
            // Implementation would go here
            alert('Funcionalidade em desenvolvimento');
        }
    }

    // Send notification
    function sendNotification() {
        alert('Redirecionando para criar notificação...');
        window.location.href = '{{ route("admin.notifications.create") }}';
    }

    // Auto-refresh every 10 seconds
    setInterval(refreshMessages, 10000);

    // Scroll to bottom on page load
    document.addEventListener('DOMContentLoaded', scrollToBottom);

    // Initialize Lucide icons
    lucide.createIcons();

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to send message
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            document.getElementById('message-form').dispatchEvent(new Event('submit'));
        }

        // Escape to focus message input
        if (e.key === 'Escape') {
            document.getElementById('message').focus();
        }
    });
</script>
@endpush
