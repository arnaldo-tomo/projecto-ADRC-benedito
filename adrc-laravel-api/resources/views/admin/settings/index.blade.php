@extends('layouts.admin')

@section('title', 'Configurações - AdRC Admin')
@section('page-title', 'Configurações do Sistema')

@section('content')
    <form method="POST" action="{{ route('admin.settings.update') }}">
        @csrf
        @method('PATCH')

        <div class="space-y-6">
            <!-- Page Header -->
            <div class="bg-white shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-lg font-medium text-gray-900">Configurações Gerais</h3>
                            <p class="text-sm text-gray-500">Gerencie as configurações globais do sistema AdRC</p>
                        </div>
                        <button type="submit"
                                class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
                            <i data-lucide="save" class="w-4 h-4 inline mr-2"></i>
                            Salvar Alterações
                        </button>
                    </div>
                </div>
            </div>

            <!-- Notifications Settings -->
            <div class="bg-white shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <div class="mb-4">
                        <h3 class="text-lg font-medium text-gray-900 flex items-center">
                            <i data-lucide="bell" class="w-5 h-5 mr-2 text-blue-600"></i>
                            Configurações de Notificação
                        </h3>
                        <p class="text-sm text-gray-500">Configure como e quando as notificações são enviadas</p>
                    </div>

                    <div class="space-y-4">
                        <!-- Auto Notifications -->
                        <div class="flex items-center justify-between">
                            <div class="flex-1">
                                <label class="text-sm font-medium text-gray-900">Notificações Automáticas</label>
                                <p class="text-sm text-gray-500">Enviar notificações automáticas para updates de ocorrências</p>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="hidden" name="auto_notifications" value="0">
                                <input type="checkbox"
                                       name="auto_notifications"
                                       value="1"
                                       {{ $settings['auto_notifications'] ? 'checked' : '' }}
                                       class="sr-only peer">
                                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <!-- Email Alerts -->
                        <div class="flex items-center justify-between">
                            <div class="flex-1">
                                <label class="text-sm font-medium text-gray-900">Alertas por Email</label>
                                <p class="text-sm text-gray-500">Enviar alertas importantes por email para administradores</p>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="hidden" name="email_alerts" value="0">
                                <input type="checkbox"
                                       name="email_alerts"
                                       value="1"
                                       {{ $settings['email_alerts'] ? 'checked' : '' }}
                                       class="sr-only peer">
                                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <!-- SMS Alerts -->
                        <div class="flex items-center justify-between">
                            <div class="flex-1">
                                <label class="text-sm font-medium text-gray-900">Alertas por SMS</label>
                                <p class="text-sm text-gray-500">Enviar alertas críticos por SMS (requer configuração de gateway)</p>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="hidden" name="sms_alerts" value="0">
                                <input type="checkbox"
                                       name="sms_alerts"
                                       value="1"
                                       {{ $settings['sms_alerts'] ? 'checked' : '' }}
                                       class="sr-only peer">
                                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- System Settings -->
            <div class="bg-white shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <div class="mb-4">
                        <h3 class="text-lg font-medium text-gray-900 flex items-center">
                            <i data-lucide="settings" class="w-5 h-5 mr-2 text-yellow-600"></i>
                            Configurações do Sistema
                        </h3>
                        <p class="text-sm text-gray-500">Configure o comportamento geral do sistema</p>
                    </div>

                    <div class="space-y-4">
                        <!-- Maintenance Mode -->
                        <div class="flex items-center justify-between">
                            <div class="flex-1">
                                <label class="text-sm font-medium text-gray-900">Modo Manutenção</label>
                                <p class="text-sm text-gray-500">Ativar modo manutenção para bloquear acesso temporariamente</p>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="hidden" name="maintenance_mode" value="0">
                                <input type="checkbox"
                                       name="maintenance_mode"
                                       value="1"
                                       {{ $settings['maintenance_mode'] ? 'checked' : '' }}
                                       class="sr-only peer"
                                       onchange="toggleMaintenanceWarning(this)">
                                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                            </label>
                        </div>

                        <!-- Maintenance Warning -->
                        <div id="maintenance-warning" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 {{ $settings['maintenance_mode'] ? '' : 'hidden' }}">
                            <div class="flex">
                                <div class="flex-shrink-0">
                                    <i data-lucide="alert-triangle" class="h-5 w-5 text-yellow-400"></i>
                                </div>
                                <div class="ml-3">
                                    <h4 class="text-sm font-medium text-yellow-800">Modo Manutenção Ativo</h4>
                                    <p class="text-sm text-yellow-700 mt-1">
                                        O sistema está em modo manutenção. Usuários não conseguirão acessar o aplicativo.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Data Backup -->
                        <div class="flex items-center justify-between">
                            <div class="flex-1">
                                <label class="text-sm font-medium text-gray-900">Backup Automático</label>
                                <p class="text-sm text-gray-500">Realizar backup automático dos dados diariamente</p>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="hidden" name="data_backup" value="0">
                                <input type="checkbox"
                                       name="data_backup"
                                       value="1"
                                       {{ $settings['data_backup'] ? 'checked' : '' }}
                                       class="sr-only peer">
                                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- User Management Settings -->
            <div class="bg-white shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <div class="mb-4">
                        <h3 class="text-lg font-medium text-gray-900 flex items-center">
                            <i data-lucide="users" class="w-5 h-5 mr-2 text-purple-600"></i>
                            Gestão de Usuários
                        </h3>
                        <p class="text-sm text-gray-500">Configure políticas para registro e gestão de usuários</p>
                    </div>

                    <div class="space-y-4">
                        <!-- User Registration -->
                        <div class="flex items-center justify-between">
                            <div class="flex-1">
                                <label class="text-sm font-medium text-gray-900">Permitir Novos Registros</label>
                                <p class="text-sm text-gray-500">Permitir que novos usuários se registrem no sistema</p>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="hidden" name="user_registration" value="0">
                                <input type="checkbox"
                                       name="user_registration"
                                       value="1"
                                       {{ $settings['user_registration'] ? 'checked' : '' }}
                                       class="sr-only peer">
                                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                        </div>

                        <!-- Geo Location -->
                        <div class="flex items-center justify-between">
                            <div class="flex-1">
                                <label class="text-sm font-medium text-gray-900">Geolocalização Obrigatória</label>
                                <p class="text-sm text-gray-500">Exigir localização para reportar ocorrências</p>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="hidden" name="geo_location" value="0">
                                <input type="checkbox"
                                       name="geo_location"
                                       value="1"
                                       {{ $settings['geo_location'] ? 'checked' : '' }}
                                       class="sr-only peer">
                                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Privacy & Security Settings -->
            <div class="bg-white shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <div class="mb-4">
                        <h3 class="text-lg font-medium text-gray-900 flex items-center">
                            <i data-lucide="shield" class="w-5 h-5 mr-2 text-green-600"></i>
                            Privacidade & Segurança
                        </h3>
                        <p class="text-sm text-gray-500">Configure políticas de privacidade e segurança</p>
                    </div>

                    <div class="space-y-4">
                        <!-- Analytics -->
                        <div class="flex items-center justify-between">
                            <div class="flex-1">
                                <label class="text-sm font-medium text-gray-900">Coleta de Analytics</label>
                                <p class="text-sm text-gray-500">Coletar dados de uso para melhorar o sistema</p>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="hidden" name="analytics" value="0">
                                <input type="checkbox"
                                       name="analytics"
                                       value="1"
                                       {{ $settings['analytics'] ? 'checked' : '' }}
                                       class="sr-only peer">
                                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Data Management -->
            <div class="bg-white shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <div class="mb-4">
                        <h3 class="text-lg font-medium text-gray-900 flex items-center">
                            <i data-lucide="database" class="w-5 h-5 mr-2 text-gray-600"></i>
                            Gestão de Dados
                        </h3>
                        <p class="text-sm text-gray-500">Ferramentas para backup, importação e exportação de dados</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <!-- Export Data -->
                        <button type="button"
                                onclick="exportData()"
                                class="flex items-center justify-center px-4 py-3 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors">
                            <i data-lucide="download" class="w-5 h-5 mr-2"></i>
                            Exportar Dados
                        </button>

                        <!-- Import Data -->
                        <button type="button"
                                onclick="importData()"
                                class="flex items-center justify-center px-4 py-3 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50 transition-colors">
                            <i data-lucide="upload" class="w-5 h-5 mr-2"></i>
                            Importar Dados
                        </button>

                        <!-- System Reset -->
                        <button type="button"
                                onclick="systemReset()"
                                class="flex items-center justify-center px-4 py-3 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors">
                            <i data-lucide="refresh-cw" class="w-5 h-5 mr-2"></i>
                            Reiniciar Sistema
                        </button>
                    </div>
                </div>
            </div>

            <!-- Danger Zone -->
            <div class="bg-white shadow rounded-lg border-2 border-red-200">
                <div class="px-4 py-5 sm:p-6">
                    <div class="mb-4">
                        <h3 class="text-lg font-medium text-red-900 flex items-center">
                            <i data-lucide="alert-triangle" class="w-5 h-5 mr-2 text-red-600"></i>
                            Zona de Perigo
                        </h3>
                        <p class="text-sm text-red-600">Ações irreversíveis que podem afetar todo o sistema</p>
                    </div>

                    <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <h4 class="text-sm font-medium text-red-900">Limpar Todos os Dados</h4>
                                <p class="text-sm text-red-700">Remove permanentemente todos os dados do sistema</p>
                            </div>
                            <button type="button"
                                    onclick="clearAllData()"
                                    class="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors">
                                <i data-lucide="trash-2" class="w-4 h-4 inline mr-2"></i>
                                Limpar Dados
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- System Information -->
            <div class="bg-white shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <div class="mb-4">
                        <h3 class="text-lg font-medium text-gray-900 flex items-center">
                            <i data-lucide="info" class="w-5 h-5 mr-2 text-gray-600"></i>
                            Informações do Sistema
                        </h3>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div class="bg-gray-50 rounded-lg p-4">
                            <span class="text-sm text-gray-500">Versão</span>
                            <p class="text-lg font-semibold text-gray-900">1.0.0</p>
                        </div>

                        <div class="bg-gray-50 rounded-lg p-4">
                            <span class="text-sm text-gray-500">Última Atualização</span>
                            <p class="text-lg font-semibold text-gray-900">{{ now()->format('d/m/Y') }}</p>
                        </div>

                        <div class="bg-gray-50 rounded-lg p-4">
                            <span class="text-sm text-gray-500">Status do Servidor</span>
                            <p class="text-lg font-semibold text-green-600">
                                <i data-lucide="check-circle" class="w-4 h-4 inline mr-1"></i>
                                Online
                            </p>
                        </div>

                        <div class="bg-gray-50 rounded-lg p-4">
                            <span class="text-sm text-gray-500">Banco de Dados</span>
                            <p class="text-lg font-semibold text-green-600">
                                <i data-lucide="database" class="w-4 h-4 inline mr-1"></i>
                                Conectado
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Save Button (Bottom) -->
            <div class="bg-white shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-500">Lembre-se de salvar suas alterações antes de sair da página</p>
                        </div>
                        <div class="flex space-x-3">
                            <button type="button"
                                    onclick="location.reload()"
                                    class="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-200 transition-colors">
                                <i data-lucide="refresh-ccw" class="w-4 h-4 inline mr-2"></i>
                                Descartar Alterações
                            </button>
                            <button type="submit"
                                    class="bg-blue-600 text-white px-6 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
                                <i data-lucide="save" class="w-4 h-4 inline mr-2"></i>
                                Salvar Configurações
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
@endsection

@push('scripts')
<script>
    // Initialize Lucide icons
    lucide.createIcons();

    function toggleMaintenanceWarning(checkbox) {
        const warning = document.getElementById('maintenance-warning');
        if (checkbox.checked) {
            warning.classList.remove('hidden');
        } else {
            warning.classList.add('hidden');
        }
    }

    function exportData() {
        if (confirm('Deseja exportar todos os dados do sistema?')) {
            // Implement export functionality
            alert('Função de exportação será implementada em breve');
        }
    }

    function importData() {
        if (confirm('Atenção: A importação pode sobrescrever dados existentes. Continuar?')) {
            // Implement import functionality
            alert('Função de importação será implementada em breve');
        }
    }

    function systemReset() {
        if (confirm('Deseja reiniciar o sistema? Isso pode levar alguns minutos.')) {
            // Implement system reset functionality
            alert('Sistema será reiniciado em breve');
        }
    }

    function clearAllData() {
        if (confirm('ATENÇÃO: Esta ação irá remover TODOS os dados do sistema permanentemente. Esta ação não pode ser desfeita!')) {
            if (confirm('Tem certeza absoluta? Todos os dados serão perdidos!')) {
                if (confirm('CONFIRMAÇÃO FINAL: Digite "CONFIRMAR" para prosseguir')) {
                    // Implement clear all data functionality
                    alert('Função de limpeza será implementada com mais segurança');
                }
            }
        }
    }

    // Auto-save warning
    let formChanged = false;
    const form = document.querySelector('form');
    const inputs = form.querySelectorAll('input[type="checkbox"]');

    inputs.forEach(input => {
        input.addEventListener('change', () => {
            formChanged = true;
        });
    });

    window.addEventListener('beforeunload', (e) => {
        if (formChanged) {
            e.preventDefault();
            e.returnValue = 'Você tem alterações não salvas. Deseja sair mesmo assim?';
        }
    });

    form.addEventListener('submit', () => {
        formChanged = false;
    });
</script>
@endpush
