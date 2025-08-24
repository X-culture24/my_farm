import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export interface AnimalProduct {
  _id: string;
  farm: string;
  livestock?: string;
  productType: 'milk' | 'eggs' | 'meat' | 'wool' | 'honey' | 'cheese' | 'yogurt' | 'butter' | 'other';
  name: string;
  description: string;
  quantity: {
    amount: number;
    unit: 'kg' | 'lbs' | 'liters' | 'gallons' | 'pieces' | 'dozens';
  };
  quality: {
    grade: 'A' | 'B' | 'C' | 'premium' | 'standard' | 'economy';
    certification: string[];
    inspectionDate: string;
    inspector: string;
  };
  production: {
    date: string;
    batchNumber: string;
    processingMethod: string;
    expiryDate: string;
    storageConditions: string;
  };
  pricing: {
    costPrice: number;
    sellingPrice: number;
    currency: string;
    marketPrice: number;
    lastUpdated: string;
  };
  inventory: {
    available: number;
    reserved: number;
    sold: number;
    minimumStock: number;
    reorderPoint: number;
  };
  sales: {
    totalSold: number;
    totalRevenue: number;
    averagePrice: number;
    lastSaleDate?: string;
  };
  status: 'available' | 'reserved' | 'sold' | 'expired' | 'recalled';
  images: string[];
  tags: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnimalProductData {
  farm: string;
  livestock?: string;
  productType: 'milk' | 'eggs' | 'meat' | 'wool' | 'honey' | 'cheese' | 'yogurt' | 'butter' | 'other';
  name: string;
  description: string;
  quantity: {
    amount: number;
    unit: 'kg' | 'lbs' | 'liters' | 'gallons' | 'pieces' | 'dozens';
  };
  quality: {
    grade: 'A' | 'B' | 'C' | 'premium' | 'standard' | 'economy';
    certification: string[];
    inspectionDate: string;
    inspector: string;
  };
  production: {
    date: string;
    batchNumber: string;
    processingMethod: string;
    expiryDate: string;
    storageConditions: string;
  };
  pricing: {
    costPrice: number;
    sellingPrice: number;
    currency: string;
    marketPrice?: number;
  };
  inventory: {
    available: number;
    reserved?: number;
    minimumStock: number;
    reorderPoint: number;
  };
  status: 'available' | 'reserved' | 'sold' | 'expired' | 'recalled';
  images?: string[];
  tags?: string[];
  notes?: string;
}

export interface UpdateAnimalProductData extends Partial<CreateAnimalProductData> {}

class AnimalProductService {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth-storage') 
      ? JSON.parse(localStorage.getItem('auth-storage')!).state.token 
      : null;
    
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getAnimalProducts(farmId?: string): Promise<AnimalProduct[]> {
    try {
      const params = farmId ? { farm: farmId } : {};
      const response = await axios.get(`${API_BASE_URL}/animal-products`, {
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

  async getAnimalProductById(productId: string): Promise<AnimalProduct> {
    try {
      const response = await axios.get(`${API_BASE_URL}/animal-products/${productId}`, {
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

  async createAnimalProduct(productData: CreateAnimalProductData): Promise<AnimalProduct> {
    try {
      const response = await axios.post(`${API_BASE_URL}/animal-products`, productData, {
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

  async updateAnimalProduct(productId: string, productData: UpdateAnimalProductData): Promise<AnimalProduct> {
    try {
      const response = await axios.put(`${API_BASE_URL}/animal-products/${productId}`, productData, {
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

  async deleteAnimalProduct(productId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.delete(`${API_BASE_URL}/animal-products/${productId}`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async updateInventory(productId: string, inventoryData: {
    quantity: number;
    type: 'add' | 'remove' | 'set';
    reason?: string;
  }): Promise<AnimalProduct> {
    try {
      const response = await axios.patch(`${API_BASE_URL}/animal-products/${productId}/inventory`, inventoryData, {
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

  async getLowStockProducts(farmId?: string): Promise<AnimalProduct[]> {
    try {
      const params = farmId ? { farmId, lowStock: true } : { lowStock: true };
      const response = await axios.get(`${API_BASE_URL}/animal-products`, {
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

  async getProductAnalytics(farmId: string, period: string = 'month'): Promise<any> {
    try {
      const response = await axios.get(`${API_BASE_URL}/animal-products/analytics/${farmId}`, {
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
}

export const animalProductService = new AnimalProductService();
