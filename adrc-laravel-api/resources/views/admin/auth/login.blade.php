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

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <style>
        [x-cloak] { display: none !important; }
        body { font-family: 'Inter', sans-serif; }

        .gradient-bg {
            background: linear-gradient(135deg, #b3adad 0%, #6366f1 100%);
        }

        .glass-effect {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .logo-animation {
            animation: logoFloat 3s ease-in-out infinite;
        }

        @keyframes logoFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }

        .input-focus {
            transition: all 0.3s ease;
        }

        .input-focus:focus {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .btn-hover {
            transition: all 0.3s ease;
        }

        .btn-hover:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 35px rgba(239, 68, 68, 0.3);
        }

        .floating-shapes {
            position: absolute;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 0;
        }

        .shape {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            animation: float 6s ease-in-out infinite;
        }

        .shape:nth-child(1) {
            width: 80px;
            height: 80px;
            top: 20%;
            left: 10%;
            animation-delay: 0s;
        }

        .shape:nth-child(2) {
            width: 120px;
            height: 120px;
            top: 60%;
            right: 10%;
            animation-delay: 2s;
        }

        .shape:nth-child(3) {
            width: 60px;
            height: 60px;
            top: 80%;
            left: 20%;
            animation-delay: 4s;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
        }
    </style>
</head>
<body class="gradient-bg min-h-screen">
    <!-- Floating Background Shapes -->
    <div class="floating-shapes">
        <div class="shape"></div>
        <div class="shape"></div>
        <div class="shape"></div>
    </div>

    <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="max-w-md w-full space-y-8">
            <div>
                <div class="flex justify-center">
                    <img src="{{ asset('AdRC-1.png') }}"
                         alt="AdRC Logo"
                         class="w-24  relative z-10 logo-animation"
                    >
                </div>
                {{-- <h2 class="mt-6 text-center text-3xl font-extrabold text-white">
                    AdRC Admin
                </h2>
                <p class="mt-2 text-center text-sm text-white/80">
                    Painel Administrativo
                </p>
                <p class="text-center text-sm text-white/60">
                    Águas da Região Centro
                </p> --}}
            </div>

            <!-- Demo credentials -->
            {{-- <div class="glass-effect rounded-2xl p-4 border border-yellow-200/30 shadow-xl">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <i data-lucide="info" class="w-5 h-5 text-yellow-600"></i>
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
            </div> --}}

            <form class="glass-effect rounded-3xl shadow-2xl p-8 space-y-6" method="POST" action="{{ route('admin.login') }}">
                @csrf

                <div class="text-center mb-6">
                    <h3 class="text-2xl font-bold text-gray-800">Bem-vindo de volta</h3>
                    <p class="text-gray-600 mt-2">Faça login para acessar o painel administrativo</p>
                </div>

                <div class="space-y-4">
                    <div>
                        <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <i data-lucide="mail" class="w-5 h-5 text-gray-400"></i>
                            </div>
                            <input id="email" name="email" type="email" autocomplete="email" required
                                   class="input-focus block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                   placeholder="Email administrativo"
                                   value="{{ old('email', 'admin@adrc.mz') }}">
                        </div>
                    </div>

                    <div x-data="{ show: false }">
                        <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">Senha</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <i data-lucide="lock" class="w-5 h-5 text-gray-400"></i>
                            </div>
                            <input id="password" name="password" :type="show ? 'text' : 'password'" autocomplete="current-password" required
                                   class="input-focus block w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                   placeholder="Senha"
                                   value="admin123">
                            <button type="button" @click="show = !show" class="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-red-600 transition-colors">
                                <i :data-lucide="show ? 'eye-off' : 'eye'" class="w-5 h-5 text-gray-400"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input id="remember" name="remember" type="checkbox" class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded">
                        <label for="remember" class="ml-2 block text-sm text-gray-700 font-medium">
                            Lembrar-me
                        </label>
                    </div>
                </div>

                @if ($errors->any())
                    <div class="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <i data-lucide="alert-circle" class="w-5 h-5 text-red-400"></i>
                            </div>
                            <div class="ml-3">
                                <h3 class="text-sm font-medium text-red-800">
                                    Erro no login
                                </h3>
                                <div class="mt-2 text-sm text-red-700">
                                    @foreach ($errors->all() as $error)
                                        <p>{{ $error }}</p>
                                    @endforeach
                                </div>
                            </div>
                        </div>
                    </div>
                @endif

                <div>
                    <button type="submit" class="btn-hover group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        <span class="absolute left-0 inset-y-0 flex items-center pl-4">
                            <i data-lucide="shield-check" class="w-5 h-5 text-red-500 group-hover:text-red-400"></i>
                        </span>
                        Entrar no Painel Administrativo
                    </button>
                </div>

                <!-- Footer -->
                <div class="text-center pt-4">
                    <p class="text-xs text-gray-500">
                        Protegido por medidas de segurança avançadas
                    </p>
                </div>
            </form>

            <!-- Additional Info -->
            <div class="text-center">
                <p class="text-sm text-white/60">
                    © 2024 AdRC - Águas da Região Centro. Todos os direitos reservados.
                </p>
            </div>
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
