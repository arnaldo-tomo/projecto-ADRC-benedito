import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR });
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { 
    addSuffix: true, 
    locale: ptBR 
  });
}

export function getStatusColor(status: string): string {
  const colors = {
    pendente: 'bg-red-100 text-red-800',
    em_andamento: 'bg-yellow-100 text-yellow-800',
    resolvido: 'bg-green-100 text-green-800',
    cancelado: 'bg-gray-100 text-gray-800',
  };
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
}

export function getPriorityColor(priority: string): string {
  const colors = {
    baixa: 'bg-blue-100 text-blue-800',
    media: 'bg-yellow-100 text-yellow-800',
    alta: 'bg-orange-100 text-orange-800',
    critica: 'bg-red-100 text-red-800',
  };
  return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
}

export function getTypeIcon(type: string): string {
  const icons = {
    vazamento: '💧',
    falta_agua: '🚰',
    pressao_baixa: '📉',
    qualidade_agua: '🧪',
    outros: '⚠️',
  };
  return icons[type as keyof typeof icons] || '⚠️';
}

export function formatPhoneNumber(phone: string): string {
  // Formatar número de telefone moçambicano
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 9) {
    return `+258 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
}

export function calculateResolutionTime(createdAt: string, resolvedAt?: string): number {
  if (!resolvedAt) return 0;
  const created = new Date(createdAt);
  const resolved = new Date(resolvedAt);
  return Math.round((resolved.getTime() - created.getTime()) / (1000 * 60 * 60)); // em horas
}