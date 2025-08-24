import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export interface Livestock {
  _id: string;
  farm: string;
  animalType: 'cattle' | 'pigs' | 'sheep' | 'goats' | 'poultry' | 'horses' | 'other';
  breed: string;
  tagNumber: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  weight: {
    current: number;
    unit: 'kg' | 'lbs';
    lastUpdated: string;
  };
  health: {
    status: 'healthy' | 'sick' | 'injured' | 'quarantine';
    vaccinations: Array<{
      name: string;
      date: string;
      nextDue: string;
      administeredBy: string;
    }>;
    medicalHistory: Array<{
      date: string;
      condition: string;
      treatment: string;
      veterinarian: string;
      notes: string;
    }>;
    lastHealthCheck: string;
  };
  breeding: {
    status: 'not-breeding' | 'pregnant' | 'lactating' | 'dry';
    pregnancyDate?: string;
    expectedCalvingDate?: string;
    lastBreedingDate?: string;
    sire?: string;
  };
  location: {
    pasture: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  feeding: {
    diet: string;
    dailyRation: number;
    unit: 'kg' | 'lbs';
    lastFed: string;
  };
  production: {
    milkProduction?: {
      dailyAverage: number;
      unit: 'liters' | 'gallons';
      lastMilking: string;
    };
    eggProduction?: {
      dailyAverage: number;
      lastCollection: string;
    };
  };
  status: 'active' | 'sold' | 'deceased' | 'transferred';
  purchaseInfo?: {
    date: string;
    price: number;
    seller: string;
    source: string;
  };
  saleInfo?: {
    date: string;
    price: number;
    buyer: string;
    destination: string;
  };
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLivestockData {
  farm: string;
  animalType: 'cattle' | 'pigs' | 'sheep' | 'goats' | 'poultry' | 'horses' | 'other';
  breed: string;
  tagNumber: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  weight: {
    current: number;
    unit: 'kg' | 'lbs';
    lastUpdated: string;
  };
  health: {
    status: 'healthy' | 'sick' | 'injured' | 'quarantine';
    vaccinations: Array<{
      name: string;
      date: string;
      nextDue: string;
      administeredBy: string;
    }>;
    medicalHistory: Array<{
      date: string;
      condition: string;
      treatment: string;
      veterinarian: string;
      notes: string;
    }>;
    lastHealthCheck: string;
  };
  breeding: {
    status: 'not-breeding' | 'pregnant' | 'lactating' | 'dry';
    pregnancyDate?: string;
    expectedCalvingDate?: string;
    lastBreedingDate?: string;
    sire?: string;
  };
  location: {
    pasture: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  feeding: {
    diet: string;
    dailyRation: number;
    unit: 'kg' | 'lbs';
    lastFed: string;
  };
  production?: {
    milkProduction?: {
      dailyAverage: number;
      unit: 'liters' | 'gallons';
      lastMilking: string;
    };
    eggProduction?: {
      dailyAverage: number;
      lastCollection: string;
    };
  };
  status: 'active' | 'sold' | 'deceased' | 'transferred';
  purchaseInfo?: {
    date: string;
    price: number;
    seller: string;
    source: string;
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
      const params = farmId ? { farm: farmId } : {};
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
