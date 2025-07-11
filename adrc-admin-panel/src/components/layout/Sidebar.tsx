'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Bell, 
  Users, 
  Settings,
  Map,
  BarChart3,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Mapa Interativo', href: '/map', icon: Map },
  { name: 'Ocorrências', href: '/occurrences', icon: FileText },
  { name: 'Mensagens', href: '/messages', icon: MessageSquare },
  { name: 'Notificações', href: '/notifications', icon: Bell },
  { name: 'Usuários', href: '/users', icon: Users },
  { name: 'Relatórios', href: '/reports', icon: BarChart3 },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <span className="text-sm font-bold text-white">AdRC</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Painel Admin</h1>
            <p className="text-xs text-gray-500">Águas da Região Centro</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">AD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              Admin AdRC
            </p>
            <p className="text-xs text-gray-500 truncate">
              admin@adrc.mz
            </p>
          </div>
        </div>
        <button className="flex w-full items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <LogOut className="mr-3 h-4 w-4" />
          Sair
        </button>
      </div>
    </div>
  );
}