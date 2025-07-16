{{-- resources/views/admin/reports/show.blade.php --}}
@extends('layouts.admin')

@section('title', 'Ocorrência #' . $report->id . ' - AdRC Admin')
@section('page-title', 'Detalhes da Ocorrência #' . $report->id)

@section('page-actions')
    <a href="{{ route('admin.reports.index') }}" class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
        <i data-lucide="arrow-left" class="w-4 h-4 inline mr-2"></i>
        Voltar
    </a>
@endsection

@section('content')
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Report Details -->
        <div class="lg:col-span-2">
            <div class="bg-white shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <div class="flex items-center justify-between mb-6">
                        <div class="flex items-center">
                            @php
                                $icon = match($report->type) {
                                    'vazamento' => 'droplets',
                                    'falta_agua' => 'alert-triangle',
                                    'pressao_baixa' => 'gauge',
                                    'qualidade_agua' => 'beaker',
                                    default => 'file-text'
                                };
                                $color = match($report->type) {
                                    'vazamento' => 'text-blue-600',
                                    'falta_agua' => 'text-red-600',
                                    'pressao_baixa' => 'text-yellow-600',
                                    'qualidade_agua' => 'text-purple-600',
                                    default => 'text-gray-600'
                                };
                            @endphp
                            <i data-lucide="{{ $icon }}" class="w-8 h-8 {{ $color }} mr-3"></i>
                            <div>
                                <h2 class="text-2xl font-bold text-gray-900">{{ $report->title }}</h2>
                                <p class="text-sm text-gray-500">{{ $report->type_text }}</p>
                            </div>
                        </div>

                        <div class="flex items-center space-x-2">
                            @php
                                $statusClass = match($report->status) {
                                    'pendente' => 'bg-red-100 text-red-800',
                                    'em_andamento' => 'bg-yellow-100 text-yellow-800',
                                    'resolvido' => 'bg-green-100 text-green-800',
                                    default => 'bg-gray-100 text-gray-800'
                                };
                                $priorityClass = match($report->priority) {
                                    'alta' => 'bg-red-100 text-red-800',
                                    'media' => 'bg-yellow-100 text-yellow-800',
                                    'baixa' => 'bg-green-100 text-green-800',
                                    default => 'bg-gray-100 text-gray-800'
                                };
                            @endphp
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium {{ $statusClass }}">
                                {{ $report->status_text }}
                            </span>
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium {{ $priorityClass }}">
                                {{ $report->priority_text }}
                            </span>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h3 class="text-lg font-medium text-gray-900 mb-3">Informações Gerais</h3>
                            <dl class="space-y-3">
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Localização</dt>
                                    <dd class="text-sm text-gray-900">{{ $report->location }}</dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Data de Criação</dt>
                                    <dd class="text-sm text-gray-900">{{ $report->created_at->format('d/m/Y H:i') }}</dd>
                                </div>
                                @if($report->resolved_at)
                                    <div>
                                        <dt class="text-sm font-medium text-gray-500">Data de Resolução</dt>
                                        <dd class="text-sm text-gray-900">{{ $report->resolved_at->format('d/m/Y H:i') }}</dd>
                                    </div>
                                @endif
                            </dl>
                        </div>

                        <div>
                            <h3 class="text-lg font-medium text-gray-900 mb-3">Informações do Usuário</h3>
                            <dl class="space-y-3">
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Nome</dt>
                                    <dd class="text-sm text-gray-900">{{ $report->user->name }}</dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Email</dt>
                                    <dd class="text-sm text-gray-900">{{ $report->user->email }}</dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Telefone</dt>
                                    <dd class="text-sm text-gray-900">{{ $report->user->phone }}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <div class="mb-6">
                        <h3 class="text-lg font-medium text-gray-900 mb-3">Descrição</h3>
                        <p class="text-gray-700">{{ $report->description }}</p>
                    </div>

                    @if($report->admin_notes)
                        <div class="mb-6">
                            <h3 class="text-lg font-medium text-gray-900 mb-3">Notas Administrativas</h3>
                            <div class="bg-gray-50 rounded-lg p-4">
                                <p class="text-gray-700">{{ $report->admin_notes }}</p>
                            </div>
                        </div>
                    @endif

                    @if($report->photos)
                        <div class="mb-6">
                            <h3 class="text-lg font-medium text-gray-900 mb-3">Fotos</h3>
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                                @foreach($report->photos as $photo)
                                    <div class="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
                                        <img src="data:image/jpeg;base64,{{ $photo }}" alt="Foto da ocorrência" class="object-cover">
                                    </div>
                                @endforeach
                            </div>
                        </div>
                    @endif
                </div>
            </div>
        </div>

        <!-- Status Update -->
        <div class="lg:col-span-1">
            <div class="bg-white shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Atualizar Status</h3>

                    <form method="POST" action="{{ route('admin.reports.update-status', $report) }}">
                        @csrf
                        @method('PUT')

                        <div class="mb-4">
                            <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                            <select id="status" name="status" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                <option value="pendente" {{ $report->status == 'pendente' ? 'selected' : '' }}>Pendente</option>
                                <option value="em_andamento" {{ $report->status == 'em_andamento' ? 'selected' : '' }}>Em Andamento</option>
                                <option value="resolvido" {{ $report->status == 'resolvido' ? 'selected' : '' }}>Resolvido</option>
                            </select>
                        </div>

                        <div class="mb-4">
                            <label for="admin_notes" class="block text-sm font-medium text-gray-700">Notas Administrativas</label>
                            <textarea id="admin_notes" name="admin_notes" rows="4" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Adicione notas sobre o progresso ou resolução...">{{ $report->admin_notes }}</textarea>
                        </div>

                        <button type="submit" class="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500">
                            Atualizar Status
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection
