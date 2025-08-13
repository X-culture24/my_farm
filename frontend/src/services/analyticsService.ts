import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export interface AnalyticsSummary {
  totalFarms: number;
  totalLivestock: number;
  totalProducts: number;
  totalSales: number;
  totalRevenue: number;
  averageRating: number;
  activeOrders: number;
  lowStockProducts: number;
}

export interface SalesAnalytics {
  period: string;
  totalSales: number;
  totalRevenue: number;
  averageOrderValue: number;
  topProducts: Array<{
    name: string;
    quantity: number;
    revenue: number;
  }>;
  salesByStatus: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  revenueTrend: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

export interface FarmAnalytics {
  farmId: string;
  farmName: string;
  livestockCount: number;
  productCount: number;
  monthlyRevenue: number;
  productivity: {
    livestockHealth: number;
    productQuality: number;
    salesEfficiency: number;
  };
  trends: {
    revenue: Array<{ month: string; value: number }>;
    production: Array<{ month: string; value: number }>;
    costs: Array<{ month: string; value: number }>;
  };
}

class AnalyticsService {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth-storage') 
      ? JSON.parse(localStorage.getItem('auth-storage')!).state.token 
      : null;
    
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getDashboardSummary(): Promise<AnalyticsSummary> {
    try {
      const response = await axios.get(`${API_BASE_URL}/analytics/dashboard`, {
        headers: this.getAuthHeaders(),
      });
      return response.data.data;
    } catch (error: any) {
      if (error.response) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async getSalesAnalytics(farmId?: string, period: string = 'month'): Promise<SalesAnalytics> {
    try {
      const params = { period };
      if (farmId) params.farmId = farmId;
      
      const response = await axios.get(`${API_BASE_URL}/analytics/sales`, {
        headers: this.getAuthHeaders(),
        params,
      });
      return response.data.data;
    } catch (error: any) {
      if (error.response) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async getFarmAnalytics(farmId: string, period: string = 'month'): Promise<FarmAnalytics> {
    try {
      const response = await axios.get(`${API_BASE_URL}/analytics/farms/${farmId}`, {
        headers: this.getAuthHeaders(),
        params: { period },
      });
      return response.data.data;
    } catch (error: any) {
      if (error.response) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async getLivestockAnalytics(farmId?: string, period: string = 'month'): Promise<any> {
    try {
      const params = { period };
      if (farmId) params.farmId = farmId;
      
      const response = await axios.get(`${API_BASE_URL}/analytics/livestock`, {
        headers: this.getAuthHeaders(),
        params,
      });
      return response.data.data;
    } catch (error: any) {
      if (error.response) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async getProductAnalytics(farmId?: string, period: string = 'month'): Promise<any> {
    try {
      const params = { period };
      if (farmId) params.farmId = farmId;
      
      const response = await axios.get(`${API_BASE_URL}/analytics/products`, {
        headers: this.getAuthHeaders(),
        params,
      });
      return response.data.data;
    } catch (error: any) {
      if (error.response) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async getFinancialReport(farmId?: string, startDate: string, endDate: string): Promise<any> {
    try {
      const params = { startDate, endDate };
      if (farmId) params.farmId = farmId;
      
      const response = await axios.get(`${API_BASE_URL}/analytics/financial`, {
        headers: this.getAuthHeaders(),
        params,
      });
      return response.data.data;
    } catch (error: any) {
      if (error.response) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async exportReport(reportType: string, farmId?: string, period: string = 'month', format: 'pdf' | 'excel' = 'pdf'): Promise<Blob> {
    try {
      const params = { reportType, period, format };
      if (farmId) params.farmId = farmId;
      
      const response = await axios.get(`${API_BASE_URL}/analytics/export`, {
        headers: this.getAuthHeaders(),
        params,
        responseType: 'blob',
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }
}

export const analyticsService = new AnalyticsService();
