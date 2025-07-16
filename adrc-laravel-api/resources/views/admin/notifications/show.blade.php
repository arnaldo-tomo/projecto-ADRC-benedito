@extends('layouts.admin')

@section('title', 'Notificação - AdRC Admin')
@section('page-title', 'Detalhes da Notificação')

@section('page-actions')
    <div class="flex space-x-2">
        @if(!$notification->sent_at)
            <form method="POST" action="{{ route('admin.notifications.send', $notification) }}" class="inline">
                @csrf
                <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                        onclick="return confirm('Tem certeza que deseja enviar esta notificação agora?')">
                    <i data-lucide="send" class="w-4 h-4 inline mr-2"></i>
                    Enviar Agora
                </button>
            </form>
        @endif

        <a href="{{ route('admin.notifications.index') }}" class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
            <i data-lucide="arrow-left" class="w-4 h-4 inline mr-2"></i>
            Voltar
        </a>
    </div>
@endsection

@section('content')
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Notification Details -->
        <div class="lg:col-span-2">
            <div class="bg-white shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-gray-900">{{ $notification->title }}</h2>

                        <div class="flex items-center space-x-2">
                            @php
                                $typeClass = match($notification->type) {
                                    'info' => 'bg-blue-100 text-blue-800',
                                    'warning' => 'bg-yellow-100 text-yellow-800',
                                    'emergency' => 'bg-red-100 text-red-800',
                                    'success' => 'bg-green-100 text-green-800',
                                    default => 'bg-gray-100 text-gray-800'
                                };
                            @endphp
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium {{ $typeClass }}">
                                {{ $notification->type_text }}
                            </span>

                            @if($notification->sent_at)
                                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                    Enviada
                                </span>
                            @elseif($notification->is_scheduled)
                                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                    Agendada
                                </span>
                            @else
                                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                    Rascunho
                                </span>
                            @endif
                        </div>
                    </div>

                    <div class="space-y-6">
                        <div>
                            <h3 class="text-lg font-medium text-gray-900 mb-3">Mensagem</h3>
                            <div class="bg-gray-50 rounded-lg p-4">
                                <p class="text-gray-700">{{ $notification->message }}</p>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 class="text-lg font-medium text-gray-900 mb-3">Detalhes do Envio</h3>
                                <dl class="space-y-3">
                                    <div>
                                        <dt class="text-sm font-medium text-gray-500">Público-Alvo</dt>
                                        <dd class="text-sm text-gray-900">{{ $notification->target_audience_text }}</dd>
                                    </div>

                                    @if($notification->location)
                                        <div>
                                            <dt class="text-sm font-medium text-gray-500">Localização</dt>
                                            <dd class="text-sm text-gray-900">{{ $notification->location }}</dd>
                                        </div>
                                    @endif

                                    <div>
                                        <dt class="text-sm font-medium text-gray-500">Destinatários</dt>
                                        <dd class="text-sm text-gray-900">{{ $notification->recipients_count }}</dd>
                                    </div>
                                </dl>
                            </div>

                            <div>
                                <h3 class="text-lg font-medium text-gray-900 mb-3">Informações de Tempo</h3>
                                <dl class="space-y-3">
                                    <div>
                                        <dt class="text-sm font-medium text-gray-500">Criada em</dt>
                                        <dd class="text-sm text-gray-900">{{ $notification->created_at->format('d/m/Y H:i') }}</dd>
                                    </div>

                                    @if($notification->scheduled_at)
                                        <div>
                                            <dt class="text-sm font-medium text-gray-500">Agendada para</dt>
                                            <dd class="text-sm text-gray-900">{{ $notification->scheduled_at->format('d/m/Y H:i') }}</dd>
                                        </div>
                                    @endif

                                    @if($notification->sent_at)
                                        <div>
                                            <dt class="text-sm font-medium text-gray-500">Enviada em</dt>
                                            <dd class="text-sm text-gray-900">{{ $notification->sent_at->format('d/m/Y H:i') }}</dd>
                                        </div>
                                    @endif
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recipients List -->
        <div class="lg:col-span-1">
            @if($notification->sent_at && $notification->users->count() > 0)
                <div class="bg-white shadow rounded-lg">
                    <div class="px-4 py-5 sm:p-6">
                        <h3 class="text-lg font-medium text-gray-900 mb-4">Destinatários</h3>

                        <div class="space-y-3 max-h-96 overflow-y-auto">
                            @foreach($notification->users as $user)
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center">
                                        <div class="bg-gray-300 rounded-full p-1">
                                            <i data-lucide="user" class="w-4 h-4 text-gray-600"></i>
                                        </div>
                                        <div class="ml-3">
                                            <p class="text-sm font-medium text-gray-900">{{ $user->name }}</p>
                                            <p class="text-xs text-gray-500">{{ $user->email }}</p>
                                        </div>
                                    </div>

                                    <div class="flex items-center">
                                        @if($user->pivot->is_read)
                                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Lida
                                            </span>
                                        @else
                                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                Não lida
                                            </span>
                                        @endif
                                    </div>
                                </div>
                            @endforeach
                        </div>

                        <div class="mt-4 pt-4 border-t border-gray-200">
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-500">Taxa de leitura:</span>
                                <span class="font-medium text-gray-900">
                                    {{ $notification->users->where('pivot.is_read', true)->count() }}/{{ $notification->users->count() }}
                                    ({{ $notification->users->count() > 0 ? round(($notification->users->where('pivot.is_read', true)->count() / $notification->users->count()) * 100) : 0 }}%)
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            @endif
        </div>
    </div>
@endsection
