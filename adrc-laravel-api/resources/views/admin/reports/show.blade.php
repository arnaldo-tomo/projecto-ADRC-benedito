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

@push('head')
    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>
        #map {
            height: 400px;
            width: 100%;
            border-radius: 0.5rem;
            border: 1px solid #e5e7eb;
        }
        .leaflet-popup-content-wrapper {
            border-radius: 8px;
        }
        .leaflet-popup-content {
            margin: 8px 12px;
            line-height: 1.4;
        }
    </style>
@endpush

@section('content')
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Report Details -->
        <div class="lg:col-span-2 space-y-6">
            <!-- Main Info Card -->
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
                                <h2 class="text-2xl font-bold text-gray-900">{{ $report->title ?? $report->type }}</h2>
                                <p class="text-sm text-gray-500">{{ $report->type_text ?? ucfirst($report->type) }}</p>
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
                                {{ $report->status_text ?? ucfirst(str_replace('_', ' ', $report->status)) }}
                            </span>
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium {{ $priorityClass }}">
                                {{ $report->priority_text ?? ucfirst($report->priority) }}
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
                                @if($report->latitude && $report->longitude)
                                    <div>
                                        <dt class="text-sm font-medium text-gray-500">Coordenadas</dt>
                                        <dd class="text-sm text-gray-900 font-mono">
                                            {{ $report->latitude }}, {{ $report->longitude }}
                                            <button onclick="copyCoordinates()" class="ml-2 text-blue-600 hover:text-blue-800">
                                                <i data-lucide="copy" class="w-4 h-4 inline"></i>
                                            </button>
                                        </dd>
                                    </div>
                                @endif
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
                                    <dd class="text-sm text-gray-900">
                                        <a href="{{ route('admin.users.show', $report->user) }}" class="text-blue-600 hover:text-blue-800">
                                            {{ $report->user->name }}
                                        </a>
                                    </dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Email</dt>
                                    <dd class="text-sm text-gray-900">{{ $report->user->email }}</dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Telefone</dt>
                                    <dd class="text-sm text-gray-900">{{ $report->user->phone ?? 'Não informado' }}</dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Endereço</dt>
                                    <dd class="text-sm text-gray-900">{{ $report->user->address ?? 'Não informado' }}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <div class="mb-6">
                        <h3 class="text-lg font-medium text-gray-900 mb-3">Descrição</h3>
                        <div class="bg-gray-50 rounded-lg p-4">
                            <p class="text-gray-700">{{ $report->description }}</p>
                        </div>
                    </div>

                    @if($report->admin_notes)
                        <div class="mb-6">
                            <h3 class="text-lg font-medium text-gray-900 mb-3">Notas Administrativas</h3>
                            <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                <p class="text-gray-700">{{ $report->admin_notes }}</p>
                            </div>
                        </div>
                    @endif

                    @if($report->photos && count($report->photos) > 0)
                        <div class="mb-6">
                            <h3 class="text-lg font-medium text-gray-900 mb-3">Fotos da Ocorrência</h3>
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                                @foreach($report->photos as $index => $photo)
                                    <div class="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden cursor-pointer" onclick="openPhotoModal({{ $index }})">
                                        <img src="data:image/jpeg;base64,{{ $photo }}" alt="Foto da ocorrência {{ $index + 1 }}" class="object-cover hover:scale-105 transition-transform duration-200">
                                    </div>
                                @endforeach
                            </div>
                        </div>
                    @endif
                </div>
            </div>

            <!-- Map Card -->
            @if($report->latitude && $report->longitude)
                <div class="bg-white shadow rounded-lg">
                    <div class="px-4 py-5 sm:p-6">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-medium text-gray-900">Localização no Mapa</h3>
                            <div class="flex space-x-2">
                                <button onclick="centerMap()" class="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md text-sm">
                                    <i data-lucide="crosshair" class="w-4 h-4 inline mr-1"></i>
                                    Centralizar
                                </button>
                                <button onclick="openInGoogleMaps()" class="text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md text-sm">
                                    <i data-lucide="external-link" class="w-4 h-4 inline mr-1"></i>
                                    Google Maps
                                </button>
                            </div>
                        </div>
                        <div id="map"></div>
                        <div class="mt-3 text-sm text-gray-500 flex items-center">
                            <i data-lucide="info" class="w-4 h-4 mr-2"></i>
                            Coordenadas: {{ $report->latitude }}, {{ $report->longitude }}
                        </div>
                    </div>
                </div>
            @else
                <div class="bg-white shadow rounded-lg">
                    <div class="px-4 py-5 sm:p-6">
                        <div class="text-center py-8">
                            <i data-lucide="map-pin-off" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
                            <h3 class="text-lg font-medium text-gray-900 mb-2">Localização não disponível</h3>
                            <p class="text-gray-500">Esta ocorrência não possui coordenadas GPS registradas.</p>
                        </div>
                    </div>
                </div>
            @endif
        </div>

        <!-- Actions Sidebar -->
        <div class="lg:col-span-1 space-y-6">
            <!-- Status Update -->
            <div class="bg-white shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Atualizar Status</h3>

                    <form method="POST" action="{{ route('admin.reports.update-status', $report) }}">
                        @csrf
                        @method('PUT')

                        <div class="mb-4">
                            <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                            <select id="status" name="status" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                <option value="pendente" {{ $report->status == 'pendente' ? 'selected' : '' }}>Pendente</option>
                                <option value="em_andamento" {{ $report->status == 'em_andamento' ? 'selected' : '' }}>Em Andamento</option>
                                <option value="resolvido" {{ $report->status == 'resolvido' ? 'selected' : '' }}>Resolvido</option>
                            </select>
                        </div>

                        <div class="mb-4">
                            <label for="priority" class="block text-sm font-medium text-gray-700">Prioridade</label>
                            <select id="priority" name="priority" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                <option value="baixa" {{ $report->priority == 'baixa' ? 'selected' : '' }}>Baixa</option>
                                <option value="media" {{ $report->priority == 'media' ? 'selected' : '' }}>Média</option>
                                <option value="alta" {{ $report->priority == 'alta' ? 'selected' : '' }}>Alta</option>
                            </select>
                        </div>

                        <div class="mb-4">
                            <label for="admin_notes" class="block text-sm font-medium text-gray-700">Notas Administrativas</label>
                            <textarea id="admin_notes" name="admin_notes" rows="4" class="mt-1 p-2 border block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Adicione notas sobre o progresso ou resolução...">{{ $report->admin_notes }}</textarea>
                        </div>

                        <button type="submit" class="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-colors">
                            <i data-lucide="save" class="w-4 h-4 inline mr-2"></i>
                            Atualizar Status
                        </button>
                    </form>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="bg-white shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h3>
                    <div class="space-y-3">
                        <a href="mailto:{{ $report->user->email }}" class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                            <i data-lucide="mail" class="w-4 h-4 mr-2"></i>
                            Contactar por Email
                        </a>

                        @if($report->user->phone)
                            <a href="tel:{{ $report->user->phone }}" class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                <i data-lucide="phone" class="w-4 h-4 mr-2"></i>
                                Ligar para Usuário
                            </a>
                        @endif

                        <a href="{{ route('admin.users.show', $report->user) }}" class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                            <i data-lucide="user" class="w-4 h-4 mr-2"></i>
                            Ver Perfil do Usuário
                        </a>

                        @if($report->latitude && $report->longitude)
                            <button onclick="shareLocation()" class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                <i data-lucide="share" class="w-4 h-4 mr-2"></i>
                                Compartilhar Localização
                            </button>
                        @endif
                    </div>
                </div>
            </div>

            <!-- Report Info -->
            <div class="bg-white shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Informações da Ocorrência</h3>
                    <dl class="space-y-3">
                        <div>
                            <dt class="text-sm font-medium text-gray-500">ID da Ocorrência</dt>
                            <dd class="text-sm text-gray-900 font-mono">#{{ $report->id }}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Tempo de Resposta</dt>
                            <dd class="text-sm text-gray-900">
                                @if($report->resolved_at)
                                    {{ $report->created_at->diffForHumans($report->resolved_at, true) }}
                                @else
                                    {{ $report->created_at->diffForHumans() }}
                                @endif
                            </dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Última Atualização</dt>
                            <dd class="text-sm text-gray-900">{{ $report->updated_at->format('d/m/Y H:i') }}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    </div>

    <!-- Photo Modal -->
    @if($report->photos && count($report->photos) > 0)
        <div id="photoModal" class="fixed inset-0 z-50 hidden bg-black bg-opacity-75 flex items-center justify-center">
            <div class="max-w-4xl max-h-full p-4">
                <div class="relative">
                    <button onclick="closePhotoModal()" class="absolute top-4 right-4 text-white hover:text-gray-300 z-10">
                        <i data-lucide="x" class="w-8 h-8"></i>
                    </button>
                    <img id="modalPhoto" src="" alt="Foto ampliada" class="max-w-full max-h-full rounded-lg">
                </div>
            </div>
        </div>
    @endif
@endsection

@push('scripts')
    <!-- Leaflet JS -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
        // Initialize Lucide icons
        lucide.createIcons();

        // Map initialization
        @if($report->latitude && $report->longitude)
            let map;
            let marker;
            const lat = {{ $report->latitude }};
            const lng = {{ $report->longitude }};

            document.addEventListener('DOMContentLoaded', function() {
                // Initialize map
                map = L.map('map').setView([lat, lng], 15);

                // Add tile layer
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors'
                }).addTo(map);

                // Custom icon for the report
                const reportIcon = L.divIcon({
                    className: 'custom-div-icon',
                    html: "<div style='background-color: #dc2626; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);'><i data-lucide='droplets' style='color: white; width: 16px; height: 16px;'></i></div>",
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                });

                // Add marker
                marker = L.marker([lat, lng], { icon: reportIcon }).addTo(map);

                // Add popup
                marker.bindPopup(`
                    <div class="text-center">
                        <strong>{{ $report->type }}</strong><br>
                        <small>{{ $report->location }}</small><br>
                        <small class="text-gray-500">{{ $report->created_at->format('d/m/Y H:i') }}</small>
                    </div>
                `);

                // Reinitialize Lucide icons after adding custom icon
                lucide.createIcons();
            });

            function centerMap() {
                map.setView([lat, lng], 15);
                marker.openPopup();
            }

            function openInGoogleMaps() {
                window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
            }

            function copyCoordinates() {
                navigator.clipboard.writeText(`${lat}, ${lng}`).then(() => {
                    // Simple notification
                    const button = event.target;
                    const originalText = button.innerHTML;
                    button.innerHTML = '<i data-lucide="check" class="w-4 h-4 inline"></i>';
                    setTimeout(() => {
                        button.innerHTML = originalText;
                        lucide.createIcons();
                    }, 2000);
                });
            }

            function shareLocation() {
                if (navigator.share) {
                    navigator.share({
                        title: 'Localização da Ocorrência #{{ $report->id }}',
                        text: '{{ $report->type }} - {{ $report->location }}',
                        url: `https://www.google.com/maps?q=${lat},${lng}`
                    });
                } else {
                    copyCoordinates();
                }
            }
        @endif

        // Photo modal functions
        @if($report->photos && count($report->photos) > 0)
            const photos = @json($report->photos);

            function openPhotoModal(index) {
                const modal = document.getElementById('photoModal');
                const modalPhoto = document.getElementById('modalPhoto');
                modalPhoto.src = `data:image/jpeg;base64,${photos[index]}`;
                modal.classList.remove('hidden');
            }

            function closePhotoModal() {
                document.getElementById('photoModal').classList.add('hidden');
            }

            // Close modal on escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    closePhotoModal();
                }
            });
        @endif
    </script>
@endpush
