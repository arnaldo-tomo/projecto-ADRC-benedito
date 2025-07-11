'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  MapPin,
  Calendar
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { DashboardStats, Occurrence } from '@/types';
import { formatRelativeTime, getStatusColor, getPriorityColor } from '@/lib/utils';

// Dados mockados para demonstração
const mockStats: DashboardStats = {
  totalOccurrences: 1247,
  pendingOccurrences: 23,
  inProgressOccurrences: 45,
  resolvedOccurrences: 1179,
  totalUsers: 8934,
  activeUsers: 2341,
  avgResolutionTime: 4.2,
  todayOccurrences: 12,
  criticalOccurrences: 3,
};

const mockRecentOccurrences: Occurrence[] = [
  {
    id: '1',
    type: 'vazamento',
    title: 'Vazamento na Rua da Manga',
    description: 'Vazamento significativo na calçada',
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
    description: 'Sem água há 3 dias',
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
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
];

const chartData = [
  { name: 'Jan', ocorrencias: 65 },
  { name: 'Fev', ocorrencias: 59 },
  { name: 'Mar', ocorrencias: 80 },
  { name: 'Abr', ocorrencias: 81 },
  { name: 'Mai', ocorrencias: 56 },
  { name: 'Jun', ocorrencias: 55 },
];

const pieData = [
  { name: 'Vazamentos', value: 45, color: '#3B82F6' },
  { name: 'Falta de Água', value: 30, color: '#EF4444' },
  { name: 'Pressão Baixa', value: 15, color: '#F59E0B' },
  { name: 'Qualidade', value: 10, color: '#10B981' },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [recentOccurrences, setRecentOccurrences] = useState<Occurrence[]>(mockRecentOccurrences);

  return (
    <Layout title="Dashboard" subtitle="Visão geral do sistema AdRC">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Ocorrências</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalOccurrences}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-3xl font-bold text-red-600">{stats.pendingOccurrences}</p>
                </div>
                <Clock className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolvidas</p>
                  <p className="text-3xl font-bold text-green-600">{stats.resolvedOccurrences}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.activeUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Ocorrências por Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="ocorrencias" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Tipos de Ocorrências</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Occurrences */}
        <Card>
          <CardHeader>
            <CardTitle>Ocorrências Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOccurrences.map((occurrence) => (
                <div key={occurrence.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium text-gray-900">{occurrence.title}</h3>
                      <Badge className={getStatusColor(occurrence.status)}>
                        {occurrence.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(occurrence.priority)}>
                        {occurrence.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{occurrence.location.address}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatRelativeTime(occurrence.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{occurrence.reportedBy.name}</p>
                    <p className="text-sm text-gray-600">{occurrence.reportedBy.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">Relatórios</h3>
              <p className="text-sm text-gray-600">Ver relatórios detalhados</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">Alertas</h3>
              <p className="text-sm text-gray-600">Gerenciar alertas críticos</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <MapPin className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">Mapa</h3>
              <p className="text-sm text-gray-600">Visualizar no mapa</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}