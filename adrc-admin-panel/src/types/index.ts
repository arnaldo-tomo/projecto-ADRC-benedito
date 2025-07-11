export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: 'admin' | 'tecnico' | 'cidadao';
  status: 'ativo' | 'inativo' | 'bloqueado';
  createdAt: string;
  lastLogin?: string;
}

export interface Occurrence {
  id: string;
  type: 'vazamento' | 'falta_agua' | 'pressao_baixa' | 'qualidade_agua' | 'outros';
  title: string;
  description: string;
  status: 'pendente' | 'em_andamento' | 'resolvido' | 'cancelado';
  priority: 'baixa' | 'media' | 'alta' | 'critica';
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  reportedBy: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
  assignedTo?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  images?: string[];
  notes?: string;
}

export interface Message {
  id: string;
  occurrenceId: string;
  senderId: string;
  senderName: string;
  senderType: 'cidadao' | 'admin' | 'tecnico';
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'emergency' | 'maintenance';
  targetAudience: 'all' | 'area' | 'specific';
  targetArea?: string;
  targetUsers?: string[];
  sentBy: string;
  sentAt: string;
  recipients: number;
  readCount: number;
}

export interface DashboardStats {
  totalOccurrences: number;
  pendingOccurrences: number;
  inProgressOccurrences: number;
  resolvedOccurrences: number;
  totalUsers: number;
  activeUsers: number;
  avgResolutionTime: number;
  todayOccurrences: number;
  criticalOccurrences: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'tecnico';
  permissions: string[];
}