import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export interface Farm {
  _id: string;
  name: string;
  owner: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  size: {
    totalAcres: number;
    cultivatedAcres: number;
    pastureAcres: number;
  };
  soilType: string[];
  climateZone: string;
  waterSource: string[];
  infrastructure: {
    irrigation: boolean;
    greenhouses: boolean;
    storage: boolean;
    processing: boolean;
  };
  certifications: string[];
  status: 'active' | 'inactive' | 'maintenance';
  createdAt: string;
  updatedAt: string;
}

export interface CreateFarmData {
  name: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  size: {
    totalAcres: number;
    cultivatedAcres: number;
    pastureAcres: number;
  };
  soilType: string[];
  climateZone: string;
  waterSource: string[];
  infrastructure: {
    irrigation: boolean;
    greenhouses: boolean;
    storage: boolean;
    processing: boolean;
  };
  certifications: string[];
}

export interface UpdateFarmData extends Partial<CreateFarmData> {}

class FarmService {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth-storage') 
      ? JSON.parse(localStorage.getItem('auth-storage')!).state.token 
      : null;
    
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getFarms(): Promise<Farm[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/farms`, {
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

  async getFarmById(farmId: string): Promise<Farm> {
    try {
      const response = await axios.get(`${API_BASE_URL}/farms/${farmId}`, {
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

  async createFarm(farmData: CreateFarmData): Promise<Farm> {
    try {
      const response = await axios.post(`${API_BASE_URL}/farms`, farmData, {
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

  async updateFarm(farmId: string, farmData: UpdateFarmData): Promise<Farm> {
    try {
      const response = await axios.put(`${API_BASE_URL}/farms/${farmId}`, farmData, {
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

  async deleteFarm(farmId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.delete(`${API_BASE_URL}/farms/${farmId}`, {
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

  async getFarmAnalytics(farmId: string, period: string = 'month'): Promise<any> {
    try {
      const response = await axios.get(`${API_BASE_URL}/farms/${farmId}/analytics`, {
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

export const farmService = new FarmService();
