'use client';

import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  User, 
  Phone,
  Eye,
  MessageSquare,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';
import { Occurrence } from '@/types';
import { formatDate, formatRelativeTime, getStatusColor, getPriorityColor, getTypeIcon } from '@/lib/utils';

// Dados mockados
const mockOccurrences: Occurrence[] = [
  {
    id: '1',
    type: 'vazamento',
    title: 'Vazamento na Rua da Manga',
    description: 'Vazamento significativo na calçada em frente ao número 123. Água jorrando há aproximadamente 2 horas.',
    status: 'pendente',
    priority: 'alta',
    location: {
      address: 'Rua da Manga, 123, Beira',
      coordinates: { lat: -19.8157, lng: 34.8369 }
    },
    reportedBy: {
      id: '1',
      name: 'João Silva',
      phone: '+258 84 123 4567',
      email: 'joao@email.com'
    },
    createdAt: '2024-01-15T14:30:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
  },
  {
    id: '2',
    type: 'falta_agua',
    title: 'Falta de água na Av. Eduardo Mondlane',
    description: 'Sem fornecimento de água há 3 dias. Toda a vizinhança está afetada.',
    status: 'em_andamento',
    priority: 'media',
    location: {
      address: 'Av. Eduardo Mondlane, 456, Beira',
      coordinates: { lat: -19.8200, lng: 34.8400 }
    },
    reportedBy: {
      id: '2',
      name: 'Maria Santos',
      phone: '+258 84 987 6543',
      email: 'maria@email.com'
    },
    assignedTo: {
      id: 'tech1',
      name: 'Carlos Técnico'
    },
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '3',
    type: 'pressao_baixa',
    title: 'Pressão baixa no Bairro da Munhava',
    description: 'Pressão muito baixa durante o dia, especialmente entre 12h e 18h.',
    status: 'resolvido',
    priority: 'baixa',
    location: {
      address: 'Bairro da Munhava, Beira',
      coordinates: { lat: -19.8100, lng: 34.8300 }
    },
    reportedBy: {
      id: '3',
      name: 'Carlos Pereira',
      phone: '+258 84 555 1234',
      email: 'carlos@email.com'
    },
    createdAt: '2024-01-08T16:45:00Z',
    updatedAt: '2024-01-12T14:20:00Z',
    resolvedAt: '2024-01-12T14:20:00Z',
  },
];

export default function OccurrencesPage() {
  const [occurrences, setOccurrences] = useState<Occurrence[]>(mockOccurrences);
  const [selectedOccurrence, setSelectedOccurrence] = useState<Occurrence | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    priority: 'all',
    search: '',
  });

  const filteredOccurrences = occurrences.filter(occurrence => {
    if (filters.status !== 'all' && occurrence.status !== filters.status) return false;
    if (filters.type !== 'all' && occurrence.type !== filters.type) return false;
    if (filters.priority !== 'all' && occurrence.priority !== filters.priority) return false;
    if (filters.search && !occurrence.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !occurrence.location.address.toLowerCase().includes(filters.search.toLowerCase()) &&
        !occurrence.reportedBy.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const handleStatusChange = (occurrenceId: string, newStatus: string) => {
    setOccurrences(prev => prev.map(occ => 
      occ.id === occurrenceId 
        ? { ...occ, status: newStatus as any, updatedAt: new Date().toISOString() }
        : occ
    ));
    setSelectedOccurrence(null);
  };

  return (
    <Layout title="Gestão de Ocorrências" subtitle="Visualizar e gerenciar todas as ocorrências reportadas">
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar ocorrências..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos os Status</option>
                <option value="pendente">Pendente</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="resolvido">Resolvido</option>
                <option value="cancelado">Cancelado</option>
              </select>
              
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos os Tipos</option>
                <option value="vazamento">Vazamento</option>
                <option value="falta_agua">Falta de Água</option>
                <option value="pressao_baixa">Pressão Baixa</option>
                <option value="qualidade_agua">Qualidade da Água</option>
              </select>
              
              <select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todas as Prioridades</option>
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
              
              <Button variant="secondary" className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Filtros Avançados</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Occurrences List */}
        <div className="grid gap-4">
          {filteredOccurrences.map((occurrence) => (
            <Card key={occurrence.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{getTypeIcon(occurrence.type)}</span>
                      <h3 className="text-lg font-semibold text-gray-900">{occurrence.title}</h3>
                      <Badge className={getStatusColor(occurrence.status)}>
                        {occurrence.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(occurrence.priority)}>
                        {occurrence.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">{occurrence.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{occurrence.location.address}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{occurrence.reportedBy.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatRelativeTime(occurrence.createdAt)}</span>
                      </div>
                    </div>
                    
                    {occurrence.assignedTo && (
                      <div className="mt-2 text-sm text-blue-600">
                        Atribuído a: {occurrence.assignedTo.name}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedOccurrence(occurrence)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Occurrence Detail Modal */}
        {selectedOccurrence && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold">{selectedOccurrence.title}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedOccurrence(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex items-center space-x-3">
                  <Badge className={getStatusColor(selectedOccurrence.status)}>
                    {selectedOccurrence.status.replace('_', ' ')}
                  </Badge>
                  <Badge className={getPriorityColor(selectedOccurrence.priority)}>
                    {selectedOccurrence.priority}
                  </Badge>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Descrição</h3>
                  <p className="text-gray-600">{selectedOccurrence.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Localização</h3>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedOccurrence.location.address}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Reportado por</h3>
                    <div className="space-y-1 text-gray-600">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{selectedOccurrence.reportedBy.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>{selectedOccurrence.reportedBy.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Cronologia</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>Criado: {formatDate(selectedOccurrence.createdAt)}</div>
                    <div>Atualizado: {formatDate(selectedOccurrence.updatedAt)}</div>
                    {selectedOccurrence.resolvedAt && (
                      <div>Resolvido: {formatDate(selectedOccurrence.resolvedAt)}</div>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-4 border-t">
                  {selectedOccurrence.status === 'pendente' && (
                    <Button
                      onClick={() => handleStatusChange(selectedOccurrence.id, 'em_andamento')}
                      className="flex items-center space-x-2"
                    >
                      <Clock className="h-4 w-4" />
                      <span>Marcar como Em Andamento</span>
                    </Button>
                  )}
                  
                  {selectedOccurrence.status !== 'resolvido' && (
                    <Button
                      onClick={() => handleStatusChange(selectedOccurrence.id, 'resolvido')}
                      variant="secondary"
                      className="flex items-center space-x-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Marcar como Resolvido</span>
                    </Button>
                  )}
                  
                  <Button variant="ghost">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Enviar Mensagem
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}