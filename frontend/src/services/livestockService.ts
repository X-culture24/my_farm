import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export interface Livestock {
  _id: string;
  farmId: string;
  animalType: 'cattle' | 'sheep' | 'goats' | 'pigs' | 'poultry' | 'horses' | 'other';
  breed: string;
  tagNumber: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  weight: {
    current: number;
    unit: 'kg' | 'lbs';
  };
  healthStatus: {
    isHealthy: boolean;
    vaccinations: Array<{
      name: string;
      date: string;
      nextDue: string;
    }>;
    medicalHistory: Array<{
      condition: string;
      diagnosis: string;
      treatment: string;
      date: string;
      veterinarian: string;
    }>;
  };
  breeding: {
    isBreeding: boolean;
    lastBreedingDate?: string;
    expectedCalvingDate?: string;
    breedingHistory: Array<{
      date: string;
      sire: string;
      success: boolean;
    }>;
  };
  location: {
    farmId: string;
    pen: string;
    pasture: string;
  };
  feeding: {
    diet: string;
    dailyRation: number;
    supplements: string[];
  };
  production: {
    milkProduction?: {
      dailyAverage: number;
      unit: 'liters' | 'gallons';
    };
    eggProduction?: {
      dailyAverage: number;
      quality: 'A' | 'B' | 'C';
    };
  };
  sales: {
    isForSale: boolean;
    price?: number;
    currency: string;
  };
  purchase: {
    purchaseDate?: string;
    purchasePrice?: number;
    seller?: string;
  };
  status: 'active' | 'sold' | 'deceased' | 'transferred';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLivestockData {
  farmId: string;
  animalType: 'cattle' | 'sheep' | 'goats' | 'pigs' | 'poultry' | 'horses' | 'other';
  breed: string;
  tagNumber: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  weight: {
    current: number;
    unit: 'kg' | 'lbs';
  };
  location: {
    farmId: string;
    pen: string;
    pasture: string;
  };
  feeding: {
    diet: string;
    dailyRation: number;
    supplements: string[];
  };
  notes?: string;
}

export interface UpdateLivestockData extends Partial<CreateLivestockData> {}

class LivestockService {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth-storage') 
      ? JSON.parse(localStorage.getItem('auth-storage')!).state.token 
      : null;
    
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getLivestock(farmId?: string): Promise<Livestock[]> {
    try {
      const params = farmId ? { farmId } : {};
      const response = await axios.get(`${API_BASE_URL}/livestock`, {
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

  async getLivestockById(livestockId: string): Promise<Livestock> {
    try {
      const response = await axios.get(`${API_BASE_URL}/livestock/${livestockId}`, {
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

  async createLivestock(livestockData: CreateLivestockData): Promise<Livestock> {
    try {
      const response = await axios.post(`${API_BASE_URL}/livestock`, livestockData, {
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

  async updateLivestock(livestockId: string, livestockData: UpdateLivestockData): Promise<Livestock> {
    try {
      const response = await axios.put(`${API_BASE_URL}/livestock/${livestockId}`, livestockData, {
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

  async deleteLivestock(livestockId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.delete(`${API_BASE_URL}/livestock/${livestockId}`, {
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

  async getLivestockHealth(farmId: string): Promise<any> {
    try {
      const response = await axios.get(`${API_BASE_URL}/livestock/health/${farmId}`, {
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

  async updateHealthRecord(livestockId: string, healthData: any): Promise<any> {
    try {
      const response = await axios.post(`${API_BASE_URL}/livestock/${livestockId}/health`, healthData, {
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
}

export const livestockService = new LivestockService();
