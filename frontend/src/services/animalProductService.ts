import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export interface AnimalProduct {
  _id: string;
  farmId: string;
  productType: 'milk' | 'eggs' | 'meat' | 'wool' | 'honey' | 'other';
  name: string;
  description: string;
  quantity: {
    available: number;
    reserved: number;
    sold: number;
    unit: string;
  };
  quality: {
    grade: 'A' | 'B' | 'C' | 'D';
    certification: string[];
    organic: boolean;
  };
  production: {
    batchNumber: string;
    productionDate: string;
    expiryDate: string;
    harvestDate?: string;
  };
  pricing: {
    unitPrice: number;
    currency: string;
    bulkDiscount: boolean;
    discountPercentage?: number;
  };
  inventory: {
    minStock: number;
    reorderPoint: number;
    supplier?: string;
    lastRestocked?: string;
  };
  sales: {
    totalSold: number;
    totalRevenue: number;
    averageRating: number;
    reviewCount: number;
  };
  status: 'available' | 'low_stock' | 'out_of_stock' | 'discontinued';
  images: string[];
  tags: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnimalProductData {
  farmId: string;
  productType: 'milk' | 'eggs' | 'meat' | 'wool' | 'honey' | 'other';
  name: string;
  description: string;
  quantity: {
    available: number;
    unit: string;
  };
  quality: {
    grade: 'A' | 'B' | 'C' | 'D';
    certification: string[];
    organic: boolean;
  };
  production: {
    batchNumber: string;
    productionDate: string;
    expiryDate: string;
    harvestDate?: string;
  };
  pricing: {
    unitPrice: number;
    currency: string;
    bulkDiscount: boolean;
    discountPercentage?: number;
  };
  inventory: {
    minStock: number;
    reorderPoint: number;
    supplier?: string;
  };
  tags: string[];
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
      const params = farmId ? { farmId } : {};
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
