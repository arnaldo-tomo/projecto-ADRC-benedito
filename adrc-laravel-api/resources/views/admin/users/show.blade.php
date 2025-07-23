@extends('layouts.admin')

@section('title', 'Detalhes do Usuário - AdRC Admin')
@section('page-title', 'Detalhes do Usuário')

@section('content')
    <!-- Header com breadcrumb -->
    <div class="mb-6">
        <nav class="flex" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 md:space-x-3">
                <li class="inline-flex items-center">
                    <a href="{{ route('admin.dashboard') }}" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                        <i data-lucide="home" class="w-4 h-4 mr-2"></i>
                        Dashboard
                    </a>
                </li>
                <li>
                    <div class="flex items-center">
                        <i data-lucide="chevron-right" class="w-4 h-4 text-gray-400"></i>
                        <a href="{{ route('admin.users.index') }}" class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2">Usuários</a>
                    </div>
                </li>
                <li aria-current="page">
                    <div class="flex items-center">
                        <i data-lucide="chevron-right" class="w-4 h-4 text-gray-400"></i>
                        <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2">{{ $user->name }}</span>
                    </div>
                </li>
            </ol>
        </nav>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Perfil do Usuário -->
        <div class="lg:col-span-1">
            <div class="bg-white shadow rounded-lg">
                <div class="px-6 py-8">
                    <!-- Avatar e Info Principal -->
                    <div class="text-center">
                        <div class="mx-auto w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                            <i data-lucide="user" class="w-12 h-12 text-white"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-2">{{ $user->name }}</h3>
                        <div class="mb-4">
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
                        </div>
                        <p class="text-sm text-gray-500">ID do Usuário: #{{ $user->id }}</p>
                    </div>

                    <!-- Informações de Contato -->
                    <div class="mt-8 border-t border-gray-200 pt-6">
                        <h4 class="text-lg font-medium text-gray-900 mb-4">Informações de Contato</h4>
                        <div class="space-y-4">
                            <div class="flex items-center">
                                <i data-lucide="mail" class="w-5 h-5 text-gray-400 mr-3"></i>
                                <div>
                                    <p class="text-sm font-medium text-gray-900">Email</p>
                                    <p class="text-sm text-gray-600">{{ $user->email }}</p>
                                </div>
                            </div>

                            @if($user->phone)
                                <div class="flex items-center">
                                    <i data-lucide="phone" class="w-5 h-5 text-gray-400 mr-3"></i>
                                    <div>
                                        <p class="text-sm font-medium text-gray-900">Telefone</p>
                                        <p class="text-sm text-gray-600">{{ $user->phone }}</p>
                                    </div>
                                </div>
                            @endif

                            @if($user->address)
                                <div class="flex items-center">
                                    <i data-lucide="map-pin" class="w-5 h-5 text-gray-400 mr-3"></i>
                                    <div>
                                        <p class="text-sm font-medium text-gray-900">Endereço</p>
                                        <p class="text-sm text-gray-600">{{ $user->address }}</p>
                                    </div>
                                </div>
                            @endif

                            <div class="flex items-center">
                                <i data-lucide="calendar" class="w-5 h-5 text-gray-400 mr-3"></i>
                                <div>
                                    <p class="text-sm font-medium text-gray-900">Membro desde</p>
                                    <p class="text-sm text-gray-600">{{ $user->created_at->format('d/m/Y') }}</p>
                                </div>
                            </div>

                            @if($user->email_verified_at)
                                <div class="flex items-center">
                                    <i data-lucide="check-circle" class="w-5 h-5 text-green-500 mr-3"></i>
                                    <div>
                                        <p class="text-sm font-medium text-gray-900">Email verificado</p>
                                        <p class="text-sm text-gray-600">{{ $user->email_verified_at->format('d/m/Y H:i') }}</p>
                                    </div>
                                </div>
                            @else
                                <div class="flex items-center">
                                    <i data-lucide="alert-circle" class="w-5 h-5 text-yellow-500 mr-3"></i>
                                    <div>
                                        <p class="text-sm font-medium text-gray-900">Email não verificado</p>
                                        <p class="text-sm text-gray-600">Pendente de verificação</p>
                                    </div>
                                </div>
                            @endif
                        </div>
                    </div>

                    <!-- Ações -->
                    <div class="mt-8 border-t border-gray-200 pt-6">
                        <div class="flex flex-col space-y-3">
                            @if($user->status !== 'active')
                                <form method="POST" action="{{ route('admin.users.update-status', $user) }}">
                                    @csrf
                                    @method('PATCH')
                                    <input type="hidden" name="status" value="active">
                                    <button type="submit" class="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                        <i data-lucide="user-check" class="w-4 h-4 mr-2"></i>
                                        Ativar Usuário
                                    </button>
                                </form>
                            @endif

                            @if($user->status !== 'blocked')
                                <form method="POST" action="{{ route('admin.users.update-status', $user) }}">
                                    @csrf
                                    @method('PATCH')
                                    <input type="hidden" name="status" value="blocked">
                                    <button type="submit" class="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                        <i data-lucide="user-x" class="w-4 h-4 mr-2"></i>
                                        Bloquear Usuário
                                    </button>
                                </form>
                            @endif

                            <a href="{{ route('admin.users.index') }}" class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                <i data-lucide="arrow-left" class="w-4 h-4 mr-2"></i>
                                Voltar à Lista
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Detalhes e Estatísticas -->
        <div class="lg:col-span-2">
            <!-- Estatísticas -->
            <div class="bg-white shadow rounded-lg mb-6">
                <div class="px-6 py-5 border-b border-gray-200">
                    <h3 class="text-lg font-medium text-gray-900">Estatísticas de Atividade</h3>
                </div>
                <div class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="text-center">
                            <div class="text-3xl font-bold text-blue-600">{{ $user->reports_count ?? 0 }}</div>
                            <div class="text-sm text-gray-500 mt-1">Total de Ocorrências</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold text-green-600">{{ $user->resolved_reports_count ?? 0 }}</div>
                            <div class="text-sm text-gray-500 mt-1">Ocorrências Resolvidas</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold text-yellow-600">{{ ($user->reports_count ?? 0) - ($user->resolved_reports_count ?? 0) }}</div>
                            <div class="text-sm text-gray-500 mt-1">Pendentes</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Histórico de Ocorrências -->
            <div class="bg-white shadow rounded-lg">
                <div class="px-6 py-5 border-b border-gray-200">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-medium text-gray-900">Histórico de Ocorrências</h3>
                        <a href="{{ route('admin.reports.index', ['user' => $user->id]) }}" class="text-sm text-blue-600 hover:text-blue-800">
                            Ver todas
                        </a>
                    </div>
                </div>
                <div class="p-6">
                    @if($user->reports && $user->reports->count() > 0)
                        <div class="space-y-4">
                            @foreach($user->reports->take(5) as $report)
                                <div class="border border-gray-200 rounded-lg p-4">
                                    <div class="flex items-start justify-between">
                                        <div class="flex-1">
                                            <div class="flex items-center space-x-2 mb-2">
                                                <h4 class="text-sm font-medium text-gray-900">{{ $report->type }}</h4>
                                                @if($report->status === 'resolvido')
                                                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                        <i data-lucide="check-circle" class="w-3 h-3 mr-1"></i>
                                                        Resolvido
                                                    </span>
                                                @elseif($report->status === 'em_andamento')
                                                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                                        <i data-lucide="clock" class="w-3 h-3 mr-1"></i>
                                                        Em Andamento
                                                    </span>
                                                @else
                                                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                                        <i data-lucide="alert-triangle" class="w-3 h-3 mr-1"></i>
                                                        Pendente
                                                    </span>
                                                @endif
                                            </div>
                                            <div class="flex items-center text-sm text-gray-500 mb-2">
                                                <i data-lucide="map-pin" class="w-4 h-4 mr-1"></i>
                                                {{ $report->location }}
                                            </div>
                                            <p class="text-sm text-gray-700">{{ Str::limit($report->description, 100) }}</p>
                                        </div>
                                        <div class="ml-4 text-right">
                                            <div class="text-sm text-gray-500">{{ $report->created_at->format('d/m/Y') }}</div>
                                            <div class="text-xs text-gray-400">{{ $report->created_at->format('H:i') }}</div>
                                        </div>
                                    </div>
                                </div>
                            @endforeach
                        </div>

                        @if($user->reports->count() > 5)
                            <div class="mt-4 text-center">
                                <a href="{{ route('admin.reports.index', ['user' => $user->id]) }}"
                                   class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                    <i data-lucide="external-link" class="w-4 h-4 mr-2"></i>
                                    Ver todas as {{ $user->reports->count() }} ocorrências
                                </a>
                            </div>
                        @endif
                    @else
                        <div class="text-center py-8">
                            <i data-lucide="file-text" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
                            <h4 class="text-lg font-medium text-gray-900 mb-2">Nenhuma ocorrência registrada</h4>
                            <p class="text-gray-500">Este usuário ainda não reportou nenhuma ocorrência.</p>
                        </div>
                    @endif
                </div>
            </div>

            <!-- Atividade Recente -->
            <div class="bg-white shadow rounded-lg mt-6">
                <div class="px-6 py-5 border-b border-gray-200">
                    <h3 class="text-lg font-medium text-gray-900">Atividade Recente</h3>
                </div>
                <div class="p-6">
                    <div class="flow-root">
                        <ul class="-mb-8">
                            <li>
                                <div class="relative pb-8">
                                    <span class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                    <div class="relative flex space-x-3">
                                        <div>
                                            <span class="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                                                <i data-lucide="user-plus" class="w-4 h-4 text-white"></i>
                                            </span>
                                        </div>
                                        <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                            <div>
                                                <p class="text-sm text-gray-500">Usuário criou conta</p>
                                            </div>
                                            <div class="text-right text-sm whitespace-nowrap text-gray-500">
                                                {{ $user->created_at->format('d/m/Y H:i') }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>

                            @if($user->email_verified_at)
                                <li>
                                    <div class="relative pb-8">
                                        <span class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                        <div class="relative flex space-x-3">
                                            <div>
                                                <span class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                                    <i data-lucide="mail-check" class="w-4 h-4 text-white"></i>
                                                </span>
                                            </div>
                                            <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                <div>
                                                    <p class="text-sm text-gray-500">Email verificado</p>
                                                </div>
                                                <div class="text-right text-sm whitespace-nowrap text-gray-500">
                                                    {{ $user->email_verified_at->format('d/m/Y H:i') }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            @endif

                            @foreach($user->reports->take(3) as $report)
                                <li>
                                    <div class="relative {{ !$loop->last ? 'pb-8' : '' }}">
                                        @if(!$loop->last)
                                            <span class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                        @endif
                                        <div class="relative flex space-x-3">
                                            <div>
                                                <span class="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center ring-8 ring-white">
                                                    <i data-lucide="alert-triangle" class="w-4 h-4 text-white"></i>
                                                </span>
                                            </div>
                                            <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                <div>
                                                    <p class="text-sm text-gray-500">Reportou ocorrência: <span class="font-medium">{{ $report->type }}</span></p>
                                                    <p class="text-xs text-gray-400">{{ $report->location }}</p>
                                                </div>
                                                <div class="text-right text-sm whitespace-nowrap text-gray-500">
                                                    {{ $report->created_at->format('d/m/Y H:i') }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            @endforeach
                        </ul>
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
