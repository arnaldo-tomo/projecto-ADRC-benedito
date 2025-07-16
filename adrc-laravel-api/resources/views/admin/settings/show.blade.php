@extends('layouts.admin')

@section('title', 'Detalhes do Usuário - AdRC Admin')
@section('page-title', 'Detalhes do Usuário')

@section('content')
    <!-- Header with User Info -->
    <div class="mb-6">
        <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <div class="bg-blue-600 rounded-full p-3">
                                <i data-lucide="user" class="w-8 h-8 text-white"></i>
                            </div>
                        </div>
                        <div class="ml-4">
                            <h1 class="text-2xl font-bold text-gray-900">{{ $user->name }}</h1>
                            <p class="text-sm text-gray-500">ID: {{ $user->id }} • Membro desde {{ $user->created_at->format('d/m/Y') }}</p>
                        </div>
                    </div>

                    <!-- Status Badge -->
                    <div class="flex items-center space-x-3">
                        @if($user->status === 'active')
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                <span class="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                                Ativo
                            </span>
                        @elseif($user->status === 'inactive')
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                <span class="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                                Inativo
                            </span>
                        @else
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                <span class="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                                Bloqueado
                            </span>
                        @endif

                        <a href="{{ route('admin.users.index') }}"
                           class="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-200 transition-colors">
                            <i data-lucide="arrow-left" class="w-4 h-4 inline mr-1"></i>
                            Voltar
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- User Information -->
        <div class="lg:col-span-2 space-y-6">
            <!-- Contact Information -->
            <div class="bg-white shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Informações de Contato</h3>

                    <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <dt class="text-sm font-medium text-gray-500 flex items-center">
                                <i data-lucide="mail" class="w-4 h-4 mr-2"></i>
                                Email
                            </dt>
                            <dd class="mt-1 text-sm text-gray-900">{{ $user->email }}</dd>
                        </div>

                        <div>
                            <dt class="text-sm font-medium text-gray-500 flex items-center">
                                <i data-lucide="phone" class="w-4 h-4 mr-2"></i>
                                Telefone
                            </dt>
                            <dd class="mt-1 text-sm text-gray-900">{{ $user->phone ?? 'Não informado' }}</dd>
                        </div>

                        <div class="sm:col-span-2">
                            <dt class="text-sm font-medium text-gray-500 flex items-center">
                                <i data-lucide="map-pin" class="w-4 h-4 mr-2"></i>
                                Endereço
                            </dt>
                            <dd class="mt-1 text-sm text-gray-900">{{ $user->address ?? 'Não informado' }}</dd>
                        </div>
                    </dl>
                </div>
            </div>

            <!-- User Reports -->
            <div class="bg-white shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-medium text-gray-900">Ocorrências do Usuário</h3>
                        <span class="text-sm text-gray-500">{{ $user->reports->count() }} total</span>
                    </div>

                    @if($user->reports->count() > 0)
                        <div class="space-y-4">
                            @foreach($user->reports->take(5) as $report)
                                <div class="border border-gray-200 rounded-lg p-4">
                                    <div class="flex items-center justify-between mb-2">
                                        <h4 class="text-sm font-medium text-gray-900">{{ $report->type }}</h4>

                                        @if($report->status === 'resolvido')
                                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <i data-lucide="check-circle" class="w-3 h-3 mr-1"></i>
                                                Resolvido
                                            </span>
                                        @elseif($report->status === 'em_andamento')
                                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                <i data-lucide="clock" class="w-3 h-3 mr-1"></i>
                                                Em Andamento
                                            </span>
                                        @else
                                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                <i data-lucide="alert-triangle" class="w-3 h-3 mr-1"></i>
                                                Pendente
                                            </span>
                                        @endif
                                    </div>

                                    <p class="text-sm text-gray-600 mb-2">{{ Str::limit($report->description, 100) }}</p>

                                    <div class="flex items-center justify-between text-xs text-gray-500">
                                        <span class="flex items-center">
                                            <i data-lucide="map-pin" class="w-3 h-3 mr-1"></i>
                                            {{ $report->location }}
                                        </span>
                                        <span>{{ $report->created_at->format('d/m/Y H:i') }}</span>
                                    </div>
                                </div>
                            @endforeach

                            @if($user->reports->count() > 5)
                                <div class="text-center">
                                    <a href="{{ route('admin.reports.index', ['user_id' => $user->id]) }}"
                                       class="text-blue-600 hover:text-blue-900 text-sm">
                                        Ver todas as {{ $user->reports->count() }} ocorrências
                                        <i data-lucide="arrow-right" class="w-4 h-4 inline ml-1"></i>
                                    </a>
                                </div>
                            @endif
                        </div>
                    @else
                        <div class="text-center py-8">
                            <i data-lucide="file-text" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
                            <h4 class="text-lg font-medium text-gray-900 mb-2">Nenhuma ocorrência</h4>
                            <p class="text-gray-500">Este usuário ainda não reportou nenhuma ocorrência.</p>
                        </div>
                    @endif
                </div>
            </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
            <!-- Quick Stats -->
            <div class="bg-white shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Estatísticas</h3>

                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-500">Total de Ocorrências</span>
                            <span class="text-lg font-semibold text-gray-900">{{ $user->reports_count }}</span>
                        </div>

                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-500">Resolvidas</span>
                            <span class="text-lg font-semibold text-green-600">{{ $user->resolved_reports_count }}</span>
                        </div>

                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-500">Pendentes</span>
                            <span class="text-lg font-semibold text-red-600">{{ $user->reports_count - $user->resolved_reports_count }}</span>
                        </div>

                        @if($user->reports_count > 0)
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-500">Taxa de Resolução</span>
                                <span class="text-lg font-semibold text-blue-600">
                                    {{ round(($user->resolved_reports_count / $user->reports_count) * 100) }}%
                                </span>
                            </div>
                        @endif
                    </div>
                </div>
            </div>

            <!-- User Actions -->
            <div class="bg-white shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Ações</h3>

                    <div class="space-y-3">
                        <!-- Change Status -->
                        @if($user->status !== 'active')
                            <form method="POST" action="{{ route('admin.users.update-status', $user) }}">
                                @csrf
                                @method('PATCH')
                                <input type="hidden" name="status" value="active">
                                <button type="submit"
                                        class="w-full bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition-colors">
                                    <i data-lucide="user-check" class="w-4 h-4 inline mr-2"></i>
                                    Ativar Usuário
                                </button>
                            </form>
                        @endif

                        @if($user->status !== 'blocked')
                            <form method="POST" action="{{ route('admin.users.update-status', $user) }}"
                                  onsubmit="return confirm('Tem certeza que deseja bloquear este usuário?')">
                                @csrf
                                @method('PATCH')
                                <input type="hidden" name="status" value="blocked">
                                <button type="submit"
                                        class="w-full bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors">
                                    <i data-lucide="user-x" class="w-4 h-4 inline mr-2"></i>
                                    Bloquear Usuário
                                </button>
                            </form>
                        @endif

                        <!-- Chat with User -->
                        <a href="{{ route('admin.chat.show', $user) }}"
                           class="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors text-center block">
                            <i data-lucide="message-circle" class="w-4 h-4 inline mr-2"></i>
                            Enviar Mensagem
                        </a>

                        <!-- Delete User -->
                        <form method="POST" action="{{ route('admin.users.destroy', $user) }}"
                              onsubmit="return confirm('ATENÇÃO: Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita e removerá todas as ocorrências associadas.')">
                            @csrf
                            @method('DELETE')
                            <button type="submit"
                                    class="w-full border border-red-300 text-red-700 px-4 py-2 rounded-md text-sm hover:bg-red-50 transition-colors">
                                <i data-lucide="trash-2" class="w-4 h-4 inline mr-2"></i>
                                Excluir Usuário
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Account Information -->
            <div class="bg-white shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Informações da Conta</h3>

                    <div class="space-y-3">
                        <div>
                            <span class="text-sm text-gray-500">Data de Registro</span>
                            <p class="text-sm font-medium text-gray-900">{{ $user->created_at->format('d/m/Y H:i') }}</p>
                        </div>

                        <div>
                            <span class="text-sm text-gray-500">Última Atualização</span>
                            <p class="text-sm font-medium text-gray-900">{{ $user->updated_at->format('d/m/Y H:i') }}</p>
                        </div>

                        @if($user->email_verified_at)
                            <div>
                                <span class="text-sm text-gray-500">Email Verificado</span>
                                <p class="text-sm font-medium text-green-600">
                                    <i data-lucide="check-circle" class="w-4 h-4 inline mr-1"></i>
                                    {{ $user->email_verified_at->format('d/m/Y H:i') }}
                                </p>
                            </div>
                        @else
                            <div>
                                <span class="text-sm text-gray-500">Email</span>
                                <p class="text-sm font-medium text-red-600">
                                    <i data-lucide="x-circle" class="w-4 h-4 inline mr-1"></i>
                                    Não verificado
                                </p>
                            </div>
                        @endif

                        @if($user->last_active_at)
                            <div>
                                <span class="text-sm text-gray-500">Último Acesso</span>
                                <p class="text-sm font-medium text-gray-900">{{ $user->last_active_at->diffForHumans() }}</p>
                            </div>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@push('scripts')
<script>
    // Initialize Lucide icons
    lucide.createIcons();
</script>
@endpush
