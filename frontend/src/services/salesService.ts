import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export interface SalesItem {
  productId: string;
  productType: 'farm_product' | 'animal_product';
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unit: string;
}

export interface Sales {
  _id: string;
  farmId: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: SalesItem[];
  orderDetails: {
    orderDate: string;
    deliveryDate?: string;
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded';
    paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'mobile_money';
  };
  totals: {
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    currency: string;
  };
  payments: Array<{
    amount: number;
    method: string;
    date: string;
    reference: string;
  }>;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSalesData {
  farmId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: Array<{
    productId: string;
    productType: 'farm_product' | 'animal_product';
    quantity: number;
    unitPrice: number;
  }>;
  deliveryDate?: string;
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'mobile_money';
  notes?: string;
}

export interface UpdateSalesData extends Partial<CreateSalesData> {}

class SalesService {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth-storage') 
      ? JSON.parse(localStorage.getItem('auth-storage')!).state.token 
      : null;
    
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getSales(farmId?: string, filters?: {
    status?: string;
    paymentStatus?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ sales: Sales[]; total: number; page: number; totalPages: number }> {
    try {
      const params = { ...filters };
      if (farmId) params.farmId = farmId;
      
      const response = await axios.get(`${API_BASE_URL}/sales`, {
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

  async getSalesById(salesId: string): Promise<Sales> {
    try {
      const response = await axios.get(`${API_BASE_URL}/sales/${salesId}`, {
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

  async createSales(salesData: CreateSalesData): Promise<Sales> {
    try {
      const response = await axios.post(`${API_BASE_URL}/sales`, salesData, {
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

  async updateSales(salesId: string, salesData: UpdateSalesData): Promise<Sales> {
    try {
      const response = await axios.put(`${API_BASE_URL}/sales/${salesId}`, salesData, {
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

  async updateSalesStatus(salesId: string, status: string): Promise<Sales> {
    try {
      const response = await axios.patch(`${API_BASE_URL}/sales/${salesId}/status`, { status }, {
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

  async addPayment(salesId: string, paymentData: {
    amount: number;
    method: string;
    reference: string;
  }): Promise<Sales> {
    try {
      const response = await axios.post(`${API_BASE_URL}/sales/${salesId}/payments`, paymentData, {
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

  async cancelSales(salesId: string, reason: string): Promise<Sales> {
    try {
      const response = await axios.post(`${API_BASE_URL}/sales/${salesId}/cancel`, { reason }, {
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

  async getSalesAnalytics(farmId: string, period: string = 'month'): Promise<any> {
    try {
      const response = await axios.get(`${API_BASE_URL}/sales/analytics/${farmId}`, {
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

  async getTopProducts(farmId: string, period: string = 'month', limit: number = 10): Promise<any> {
    try {
      const response = await axios.get(`${API_BASE_URL}/sales/top-products/${farmId}`, {
        headers: this.getAuthHeaders(),
        params: { period, limit },
      });
      return response.data.data;
    } catch (error: any) {
      if (error.response) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }
}

export const salesService = new SalesService();
