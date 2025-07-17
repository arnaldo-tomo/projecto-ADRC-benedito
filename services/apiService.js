// services/apiService.js
import authService from './authService';

class ApiService {
  constructor() {
    this.baseUrl = 'https://your-api-url.com/api';
  }

  // Método genérico para fazer requisições
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await authService.makeAuthenticatedRequest(url, options);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro na requisição');
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Métodos específicos para diferentes endpoints
  async getHomeData() {
    try {
      // Para demonstração, retornar dados simulados
      return {
        notifications: [
          {
            id: 1,
            type: 'warning',
            title: 'Interrupção Programada',
            message: 'Manutenção preventiva na zona da Manga - 14h às 18h',
            time: '2h atrás',
          },
          {
            id: 2,
            type: 'info',
            title: 'Serviço Restabelecido',
            message: 'Fornecimento normalizado na Av. Eduardo Mondlane',
            time: '5h atrás',
          },
        ],
        serviceStatus: {
          waterSupply: 'normal',
          scheduledInterruptions: 2,
          activeIncidents: 1,
        },
        userStats: {
          totalReports: 12,
          resolvedReports: 8,
          pendingReports: 4,
        }
      };
    } catch (error) {
      console.error('Error loading home data:', error);
      throw new Error('Erro ao carregar dados da página inicial');
    }
  }

  async getReports() {
    try {
      // Dados simulados de ocorrências
      return [
        {
          id: 1,
          type: 'Vazamento',
          location: 'Rua da Manga, 123',
          status: 'em_andamento',
          date: '2024-01-15',
          time: '14:30',
          priority: 'alta',
        },
        {
          id: 2,
          type: 'Falta de Água',
          location: 'Av. Eduardo Mondlane, 456',
          status: 'resolvido',
          date: '2024-01-10',
          time: '09:15',
          priority: 'media',
        },
        {
          id: 3,
          type: 'Pressão Baixa',
          location: 'Bairro da Munhava',
          status: 'pendente',
          date: '2024-01-08',
          time: '16:45',
          priority: 'baixa',
        },
      ];
    } catch (error) {
      console.error('Error loading reports:', error);
      throw new Error('Erro ao carregar ocorrências');
    }
  }

  async getReport(id) {
    try {
      // Dados simulados de uma ocorrência específica
      return {
        id: id,
        type: 'Vazamento',
        location: 'Rua da Manga, 123',
        description: 'Vazamento significativo na calçada em frente ao número 123.',
        status: 'em_andamento',
        priority: 'alta',
        date: '2024-01-15',
        time: '14:30',
        user: {
          name: 'João Silva',
          email: 'joao.silva@email.com',
          phone: '+258 84 123 4567'
        },
        coordinates: {
          latitude: -19.8157,
          longitude: 34.8369
        },
        updates: [
          {
            id: 1,
            message: 'Ocorrência registrada com sucesso',
            timestamp: '2024-01-15 14:30',
            type: 'created'
          },
          {
            id: 2,
            message: 'Equipe técnica foi notificada',
            timestamp: '2024-01-15 14:35',
            type: 'assigned'
          }
        ]
      };
    } catch (error) {
      console.error('Error loading report:', error);
      throw new Error('Erro ao carregar detalhes da ocorrência');
    }
  }

  async createReport(reportData) {
    try {
      // Simular criação de ocorrência
      const newReport = {
        id: Date.now(),
        ...reportData,
        status: 'pendente',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
      };

      return {
        success: true,
        report: newReport,
        message: 'Ocorrência criada com sucesso'
      };
    } catch (error) {
      console.error('Error creating report:', error);
      throw new Error('Erro ao criar ocorrência');
    }
  }

  async sendMessage(message) {
    try {
      // Simular envio de mensagem
      return {
        success: true,
        message: {
          id: Date.now(),
          text: message,
          sender: 'user',
          timestamp: new Date().toISOString(),
        }
      };
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Erro ao enviar mensagem');
    }
  }

  async getNotifications() {
    try {
      // Simular notificações
      return [
        {
          id: 1,
          title: 'Ocorrência Atualizada',
          message: 'Sua ocorrência #123 foi atualizada',
          type: 'info',
          timestamp: new Date().toISOString(),
          read: false,
        },
        {
          id: 2,
          title: 'Manutenção Programada',
          message: 'Haverá manutenção na sua área amanhã',
          type: 'warning',
          timestamp: new Date().toISOString(),
          read: true,
        },
      ];
    } catch (error) {
      console.error('Error loading notifications:', error);
      throw new Error('Erro ao carregar notificações');
    }
  }
}

export default new ApiService();