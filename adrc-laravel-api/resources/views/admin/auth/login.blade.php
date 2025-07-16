{{-- resources/views/admin/auth/login.blade.php --}}
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Login - AdRC Admin</title>

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Icons -->
    <script src="https://cdn.jsdelivr.net/npm/lucide@latest/dist/umd/lucide.js"></script>

    <!-- Alpine.js -->
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>

    <style>
        [x-cloak] { display: none !important; }
    </style>
</head>
<body class="bg-gray-50">
    <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div>
                <div class="flex justify-center">
                    <div class="bg-red-600 rounded-full p-4">
                        <i data-lucide="shield" class="w-12 h-12 text-white"></i>
                    </div>
                </div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    AdRC Admin
                </h2>
                <p class="mt-2 text-center text-sm text-gray-600">
                    Painel Administrativo
                </p>
                <p class="text-center text-sm text-gray-600">
                    Águas da Região Centro
                </p>
            </div>

            <!-- Demo credentials -->
            <div class="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <i data-lucide="info" class="w-5 h-5 text-yellow-400"></i>
                    </div>
                    <div class="ml-3">
                        <h3 class="text-sm font-medium text-yellow-800">
                            Credenciais de Demonstração
                        </h3>
                        <div class="mt-2 text-sm text-yellow-700">
                            <p>Email: admin@adrc.mz</p>
                            <p>Senha: admin123</p>
                        </div>
                    </div>
                </div>
            </div>

            <form class="mt-8 space-y-6" method="POST" action="{{ route('admin.login') }}">
                @csrf

                <div class="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label for="email" class="sr-only">Email</label>
                        <input id="email" name="email" type="email" autocomplete="email" required
                               class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                               placeholder="Email administrativo"
                               value="{{ old('email', 'admin@adrc.mz') }}">
                    </div>
                    <div x-data="{ show: false }">
                        <label for="password" class="sr-only">Senha</label>
                        <div class="relative">
                            <input id="password" name="password" :type="show ? 'text' : 'password'" autocomplete="current-password" required
                                   class="appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                                   placeholder="Senha"
                                   value="admin123">
                            <button type="button" @click="show = !show" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <i :data-lucide="show ? 'eye-off' : 'eye'" class="w-5 h-5 text-gray-400"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input id="remember" name="remember" type="checkbox" class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded">
                        <label for="remember" class="ml-2 block text-sm text-gray-900">
                            Lembrar-me
                        </label>
                    </div>
                </div>

                @if ($errors->any())
                    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        @foreach ($errors->all() as $error)
                            <p class="text-sm">{{ $error }}</p>
                        @endforeach
                    </div>
                @endif

                <div>
                    <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                            <i data-lucide="lock" class="w-5 h-5 text-red-500 group-hover:text-red-400"></i>
                        </span>
                        Entrar no Painel
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script>
        // Initialize Lucide icons
        lucide.createIcons();

        // Re-initialize icons after Alpine.js updates
        document.addEventListener('alpine:init', () => {
            Alpine.nextTick(() => {
                lucide.createIcons();
            });
        });
    </script>
</body>
</html>
