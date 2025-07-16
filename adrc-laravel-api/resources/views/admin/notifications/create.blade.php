@extends('layouts.admin')

@section('title', 'Nova Notificação - AdRC Admin')
@section('page-title', 'Nova Notificação')

@section('page-actions')
    <a href="{{ route('admin.notifications.index') }}" class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
        <i data-lucide="arrow-left" class="w-4 h-4 inline mr-2"></i>
        Voltar
    </a>
@endsection

@section('content')
    <div class="max-w-4xl mx-auto">
        <form method="POST" action="{{ route('admin.notifications.store') }}" x-data="notificationForm()" class="space-y-6">
            @csrf

            <div class="bg-white shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-6">Informações da Notificação</h3>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label for="title" class="block text-sm font-medium text-gray-700">Título *</label>
                            <input type="text" id="title" name="title" required maxlength="255"
                                   class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                   placeholder="Ex: Interrupção Programada"
                                   value="{{ old('title') }}">
                            @error('title')
                                <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div>
                            <label for="type" class="block text-sm font-medium text-gray-700">Tipo *</label>
                            <select id="type" name="type" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                <option value="">Selecione o tipo</option>
                                <option value="info" {{ old('type') == 'info' ? 'selected' : '' }}>Informação</option>
                                <option value="warning" {{ old('type') == 'warning' ? 'selected' : '' }}>Aviso</option>
                                <option value="emergency" {{ old('type') == 'emergency' ? 'selected' : '' }}>Emergência</option>
                                <option value="success" {{ old('type') == 'success' ? 'selected' : '' }}>Sucesso</option>
                            </select>
                            @error('type')
                                <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>
                    </div>

                    <div class="mt-6">
                        <label for="message" class="block text-sm font-medium text-gray-700">Mensagem *</label>
                        <textarea id="message" name="message" required rows="4" maxlength="1000"
                                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Digite a mensagem completa...">{{ old('message') }}</textarea>
                        <p class="mt-2 text-sm text-gray-500">
                            <span x-text="$el.previousElementSibling.value.length"></span>/1000 caracteres
                        </p>
                        @error('message')
                            <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                        @enderror
                    </div>
                </div>
            </div>

            <div class="bg-white shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-6">Público-Alvo</h3>

                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Selecione o público-alvo *</label>
                            <div class="mt-2 space-y-2">
                                <label class="flex items-center">
                                    <input type="radio" name="target_audience" value="all"
                                           x-model="targetAudience"
                                           class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                           {{ old('target_audience') == 'all' ? 'checked' : '' }}>
                                    <span class="ml-2 text-sm text-gray-700">Todos os usuários</span>
                                </label>

                                <label class="flex items-center">
                                    <input type="radio" name="target_audience" value="location"
                                           x-model="targetAudience"
                                           class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                           {{ old('target_audience') == 'location' ? 'checked' : '' }}>
                                    <span class="ml-2 text-sm text-gray-700">Por localização</span>
                                </label>

                                <label class="flex items-center">
                                    <input type="radio" name="target_audience" value="active"
                                           x-model="targetAudience"
                                           class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                           {{ old('target_audience') == 'active' ? 'checked' : '' }}>
                                    <span class="ml-2 text-sm text-gray-700">Usuários ativos (últimos 7 dias)</span>
                                </label>
                            </div>
                            @error('target_audience')
                                <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div x-show="targetAudience === 'location'" x-cloak>
                            <label for="location" class="block text-sm font-medium text-gray-700">Localização Específica</label>
                            <input type="text" id="location" name="location" maxlength="255"
                                   class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                   placeholder="Ex: Bairro da Manga, Av. Eduardo Mondlane..."
                                   value="{{ old('location') }}">
                            @error('location')
                                <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-6">Agendamento</h3>

                    <div class="space-y-4">
                        <div class="flex items-center">
                            <input type="checkbox" id="is_scheduled" name="is_scheduled" value="1"
                                   x-model="isScheduled"
                                   class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                   {{ old('is_scheduled') ? 'checked' : '' }}>
                            <label for="is_scheduled" class="ml-2 text-sm text-gray-700">
                                Agendar envio
                            </label>
                        </div>

                        <div x-show="isScheduled" x-cloak>
                            <label for="scheduled_at" class="block text-sm font-medium text-gray-700">Data e Hora do Envio</label>
                            <input type="datetime-local" id="scheduled_at" name="scheduled_at"
                                   class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                   value="{{ old('scheduled_at') }}">
                            @error('scheduled_at')
                                <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex justify-end space-x-4">
                <a href="{{ route('admin.notifications.index') }}"
                   class="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400">
                    Cancelar
                </a>
                <button type="submit"
                        class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500">
                    <span x-text="isScheduled ? 'Agendar Notificação' : 'Enviar Agora'"></span>
                </button>
            </div>
        </form>
    </div>
@endsection

@push('scripts')
<script>
    function notificationForm() {
        return {
            targetAudience: '{{ old('target_audience', 'all') }}',
            isScheduled: {{ old('is_scheduled') ? 'true' : 'false' }}
        }
    }
</script>
@endpush
