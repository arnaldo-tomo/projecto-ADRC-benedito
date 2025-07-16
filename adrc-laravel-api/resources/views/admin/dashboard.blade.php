{{-- resources/views/admin/dashboard.blade.php --}}
@extends('layouts.admin')

@section('title', 'Dashboard - AdRC Admin')
@section('page-title', 'Dashboard')

@section('content')
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <i data-lucide="file-text" class="w-8 h-8 text-blue-600"></i>
                    </div>
                    <div class="ml-5 w-0 flex-1">
                        <dl>
                            <dt class="text-sm font-medium text-gray-500 truncate">
                                Total Ocorrências
                            </dt>
                            <dd class="text-lg font-medium text-gray-900">
                                {{ $stats['total_reports'] }}
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <i data-lucide="clock" class="w-8 h-8 text-yellow-600"></i>
                    </div>
                    <div class="ml-5 w-0 flex-1">
                        <dl>
                            <dt class="text-sm font-medium text-gray-500 truncate">
                                Pendentes
                            </dt>
                            <dd class="text-lg font-medium text-gray-900">
                                {{ $stats['pending_reports'] }}
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <i data-lucide="check-circle" class="w-8 h-8 text-green-600"></i>
                    </div>
                    <div class="ml-5 w-0 flex-1">
                        <dl>
                            <dt class="text-sm font-medium text-gray-500 truncate">
                                Resolvidas
                            </dt>
                            <dd class="text-lg font-medium text-gray-900">
                                {{ $stats['resolved_reports'] }}
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <i data-lucide="users" class="w-8 h-8 text-purple-600"></i>
                    </div>
                    <div class="ml-5 w-0 flex-1">
                        <dl>
                            <dt class="text-sm font-medium text-gray-500 truncate">
                                Usuários Ativos
                            </dt>
                            <dd class="text-lg font-medium text-gray-900">
                                {{ $stats['active_users'] }}
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Charts and Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Reports by Type Chart -->
        <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Ocorrências por Tipo
                </h3>
                <div class="h-64">
                    <canvas id="reportsByTypeChart"></canvas>
                </div>
            </div>
        </div>

        <!-- Reports by Status Chart -->
        <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Ocorrências por Status
                </h3>
                <div class="h-64">
                    <canvas id="reportsByStatusChart"></canvas>
                </div>
            </div>
        </div>
    </div>

    <!-- Monthly Reports Trend -->
    <div class="bg-white shadow rounded-lg mb-8">
        <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                Tendência Mensal de Ocorrências
            </h3>
            <div class="h-64">
                <canvas id="monthlyReportsChart"></canvas>
            </div>
        </div>
    </div>

    <!-- Recent Reports -->
    <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                    Ocorrências Recentes
                </h3>
                <a href="{{ route('admin.reports.index') }}" class="text-sm font-medium text-blue-600 hover:text-blue-500">
                    Ver todas
                </a>
            </div>

            <div class="overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tipo
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Localização
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Usuário
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Data
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        @foreach($recent_reports as $report)
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap">
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
                                        <i data-lucide="{{ $icon }}" class="w-5 h-5 {{ $color }} mr-2"></i>
                                        <span class="text-sm font-medium text-gray-900">
                                            {{ $report->type_text }}
                                        </span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {{ Str::limit($report->location, 30) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {{ $report->user->name }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    @php
                                        $statusClass = match($report->status) {
                                            'pendente' => 'bg-red-100 text-red-800',
                                            'em_andamento' => 'bg-yellow-100 text-yellow-800',
                                            'resolvido' => 'bg-green-100 text-green-800',
                                            default => 'bg-gray-100 text-gray-800'
                                        };
                                    @endphp
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {{ $statusClass }}">
                                        {{ $report->status_text }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {{ $report->created_at->format('d/m/Y H:i') }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <a href="{{ route('admin.reports.show', $report) }}" class="text-blue-600 hover:text-blue-900">
                                        Ver
                                    </a>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>
@endsection

@push('scripts')
<script>
    // Reports by Type Chart
    const typeCtx = document.getElementById('reportsByTypeChart').getContext('2d');
    new Chart(typeCtx, {
        type: 'doughnut',
        data: {
            labels: [
                @foreach($reports_by_type as $type)
                    '{{ ucfirst(str_replace('_', ' ', $type->type)) }}',
                @endforeach
            ],
            datasets: [{
                data: [
                    @foreach($reports_by_type as $type)
                        {{ $type->count }},
                    @endforeach
                ],
                backgroundColor: [
                    '#3B82F6',
                    '#EF4444',
                    '#F59E0B',
                    '#8B5CF6',
                    '#10B981'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Reports by Status Chart
    const statusCtx = document.getElementById('reportsByStatusChart').getContext('2d');
    new Chart(statusCtx, {
        type: 'bar',
        data: {
            labels: [
                @foreach($reports_by_status as $status)
                    '{{ ucfirst(str_replace('_', ' ', $status->status)) }}',
                @endforeach
            ],
            datasets: [{
                label: 'Quantidade',
                data: [
                    @foreach($reports_by_status as $status)
                        {{ $status->count }},
                    @endforeach
                ],
                backgroundColor: [
                    '#EF4444',
                    '#F59E0B',
                    '#10B981'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Monthly Reports Trend Chart
    const monthlyCtx = document.getElementById('monthlyReportsChart').getContext('2d');
    new Chart(monthlyCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            datasets: [{
                label: 'Ocorrências',
                data: [
                    @for($i = 1; $i <= 12; $i++)
                        {{ $monthly_reports->where('month', $i)->first()->count ?? 0 }},
                    @endfor
                ],
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
</script>
@endpush
