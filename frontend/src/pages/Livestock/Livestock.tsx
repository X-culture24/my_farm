import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Pets as PetsIcon,
  TrendingUp as ProductionIcon,
} from '@mui/icons-material';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Livestock, CreateLivestockData } from '../../services/livestockService';
// import { farmService } from '../../services/farmService';

const LivestockPage: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingLivestock, setEditingLivestock] = useState<Livestock | null>(null);
  const [selectedFarm, setSelectedFarm] = useState<string>('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Mock data and state
  const [farms, setFarms] = useState<any[]>([]);
  const [livestock, setLivestock] = useState<Livestock[]>([]);
  const [isLoading] = useState(false);

  // Load mock data
  useEffect(() => {
    setFarms([
      { _id: '1', name: 'Main Farm' },
      { _id: '2', name: 'North Pasture' }
    ]);
    setLivestock([
      {
        _id: '1',
        farm: '1',
        animalType: 'cattle',
        breed: 'Holstein',
        tagNumber: 'COW001',
        gender: 'female',
        dateOfBirth: '2020-01-15',
        weight: { current: 450, unit: 'kg', lastUpdated: new Date().toISOString() },
        health: { status: 'healthy', vaccinations: [], medicalHistory: [], lastHealthCheck: new Date().toISOString() },
        breeding: { status: 'lactating' },
        location: { pasture: 'Field A', coordinates: { latitude: 0, longitude: 0 } },
        feeding: { diet: 'Grass and grain', dailyRation: 25, unit: 'kg', lastFed: new Date().toISOString() },
        production: { milkProduction: { dailyAverage: 25, unit: 'liters', lastMilking: new Date().toISOString() } },
        status: 'active',
        notes: 'High milk producer',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);
  }, []);

  // Mock mutations
  const createMutation = {
    mutate: (data: CreateLivestockData) => {
      const newLivestock = {
        ...data,
        _id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Livestock;
      setLivestock(prev => [...prev, newLivestock]);
      setOpenDialog(false);
      setSnackbar({ open: true, message: 'Livestock created successfully!', severity: 'success' });
    },
    isPending: false
  };

  const updateMutation = {
    mutate: ({ id, data }: { id: string; data: Partial<CreateLivestockData> }) => {
      setLivestock(prev => prev.map(animal => 
        animal._id === id ? { ...animal, ...data } : animal
      ));
      setOpenDialog(false);
      setEditingLivestock(null);
      setSnackbar({ open: true, message: 'Livestock updated successfully!', severity: 'success' });
    },
    isPending: false
  };

  const deleteMutation = {
    mutate: (id: string) => {
      setLivestock(prev => prev.filter(animal => animal._id !== id));
      setSnackbar({ open: true, message: 'Livestock deleted successfully!', severity: 'success' });
    }
  };

  const handleEdit = (animal: Livestock) => {
    setEditingLivestock(animal);
    setOpenDialog(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this livestock?')) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'sold': return 'info';
      case 'deceased': return 'error';
      case 'transferred': return 'warning';
      default: return 'default';
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'success';
      case 'sick': return 'error';
      case 'injured': return 'warning';
      case 'quarantine': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PetsIcon /> Livestock Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          disabled={farms.length === 0}
        >
          Add Livestock
        </Button>
      </Box>

      {/* Farm Filter */}
      <Box sx={{ mb: 3 }}>
        <TextField
          select
          label="Filter by Farm"
          value={selectedFarm}
          onChange={(e) => setSelectedFarm(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All Farms</MenuItem>
          {farms.map((farm: any) => (
            <MenuItem key={farm._id} value={farm._id}>
              {farm.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Livestock Grid */}
      <Grid container spacing={3}>
        {livestock.map((animal: Livestock) => (
          <Grid item xs={12} md={6} lg={4} key={animal._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="h2">
                    {animal.breed} - {animal.tagNumber}
                  </Typography>
                  <Box>
                    <IconButton size="small" onClick={() => handleEdit(animal)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(animal._id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label={animal.animalType} 
                    size="small" 
                    sx={{ mr: 1, mb: 1 }} 
                  />
                  <Chip 
                    label={animal.status} 
                    size="small" 
                    color={getStatusColor(animal.status) as any}
                    sx={{ mr: 1, mb: 1 }} 
                  />
                  <Chip 
                    label={animal.health.status} 
                    size="small" 
                    color={getHealthStatusColor(animal.health.status) as any}
                    sx={{ mr: 1, mb: 1 }} 
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>Gender:</strong> {animal.gender}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>Weight:</strong> {animal.weight.current} {animal.weight.unit}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>Location:</strong> {animal.location.pasture}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>Diet:</strong> {animal.feeding.diet}
                </Typography>

                {animal.production?.milkProduction && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <ProductionIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    <strong>Milk:</strong> {animal.production.milkProduction.dailyAverage} {animal.production.milkProduction.unit}/day
                  </Typography>
                )}

                {animal.production?.eggProduction && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <ProductionIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    <strong>Eggs:</strong> {animal.production.eggProduction.dailyAverage}/day
                  </Typography>
                )}

                {animal.notes && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                    {animal.notes}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {livestock.length === 0 && !isLoading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <PetsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No livestock found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {farms.length === 0 
              ? 'Create a farm first to add livestock'
              : 'Add your first livestock to get started'
            }
          </Typography>
        </Box>
      )}

      {/* Add/Edit Dialog */}
      <LivestockDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setEditingLivestock(null);
        }}
        livestock={editingLivestock}
        farms={farms}
        onSubmit={(data) => {
          if (editingLivestock) {
            updateMutation.mutate({ id: editingLivestock._id, data });
          } else {
            createMutation.mutate(data);
          }
        }}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Livestock Dialog Component
interface LivestockDialogProps {
  open: boolean;
  onClose: () => void;
  livestock: Livestock | null;
  farms: any[];
  onSubmit: (data: CreateLivestockData) => void;
  isLoading: boolean;
}

const LivestockDialog: React.FC<LivestockDialogProps> = ({
  open,
  onClose,
  livestock,
  farms,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState<CreateLivestockData>({
    farm: '',
    animalType: 'cattle',
    breed: '',
    tagNumber: '',
    gender: 'female',
    dateOfBirth: new Date().toISOString().split('T')[0],
    weight: {
      current: 0,
      unit: 'kg',
      lastUpdated: new Date().toISOString(),
    },
    health: {
      status: 'healthy',
      vaccinations: [],
      medicalHistory: [],
      lastHealthCheck: new Date().toISOString(),
    },
    breeding: {
      status: 'not-breeding',
    },
    location: {
      pasture: '',
      coordinates: {
        latitude: 0,
        longitude: 0,
      },
    },
    feeding: {
      diet: '',
      dailyRation: 0,
      unit: 'kg',
      lastFed: new Date().toISOString(),
    },
    status: 'active',
    notes: '',
  });

  useEffect(() => {
    if (livestock) {
      setFormData({
        farm: livestock.farm,
        animalType: livestock.animalType,
        breed: livestock.breed,
        tagNumber: livestock.tagNumber,
        gender: livestock.gender,
        dateOfBirth: livestock.dateOfBirth.split('T')[0],
        weight: livestock.weight,
        health: livestock.health,
        breeding: livestock.breeding,
        location: livestock.location,
        feeding: livestock.feeding,
        production: livestock.production,
        status: livestock.status,
        purchaseInfo: livestock.purchaseInfo,
        notes: livestock.notes || '',
      });
    } else {
      // Reset form for new livestock
      setFormData({
        farm: '',
        animalType: 'cattle',
        breed: '',
        tagNumber: '',
        gender: 'female',
        dateOfBirth: new Date().toISOString().split('T')[0],
        weight: {
          current: 0,
          unit: 'kg',
          lastUpdated: new Date().toISOString(),
        },
        health: {
          status: 'healthy',
          vaccinations: [],
          medicalHistory: [],
          lastHealthCheck: new Date().toISOString(),
        },
        breeding: {
          status: 'not-breeding',
        },
        location: {
          pasture: '',
          coordinates: {
            latitude: 0,
            longitude: 0,
          },
        },
        feeding: {
          diet: '',
          dailyRation: 0,
          unit: 'kg',
          lastFed: new Date().toISOString(),
        },
        status: 'active',
        notes: '',
      });
    }
  }, [livestock]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof CreateLivestockData] as any),
        [field]: value,
      },
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {livestock ? 'Edit Livestock' : 'Add New Livestock'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Basic Information */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Farm"
                value={formData.farm}
                onChange={(e) => handleInputChange('farm', e.target.value)}
                required
              >
                {farms.map((farm: any) => (
                  <MenuItem key={farm._id} value={farm._id}>
                    {farm.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Animal Type"
                value={formData.animalType}
                onChange={(e) => handleInputChange('animalType', e.target.value)}
                required
              >
                <MenuItem value="cattle">Cattle</MenuItem>
                <MenuItem value="pigs">Pigs</MenuItem>
                <MenuItem value="sheep">Sheep</MenuItem>
                <MenuItem value="goats">Goats</MenuItem>
                <MenuItem value="poultry">Poultry</MenuItem>
                <MenuItem value="horses">Horses</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Breed"
                value={formData.breed}
                onChange={(e) => handleInputChange('breed', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tag Number"
                value={formData.tagNumber}
                onChange={(e) => handleInputChange('tagNumber', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Gender"
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                required
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Date of Birth"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            {/* Weight */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Current Weight"
                value={formData.weight.current}
                onChange={(e) => handleNestedInputChange('weight', 'current', parseFloat(e.target.value))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Weight Unit"
                value={formData.weight.unit}
                onChange={(e) => handleNestedInputChange('weight', 'unit', e.target.value)}
                required
              >
                <MenuItem value="kg">Kilograms</MenuItem>
                <MenuItem value="lbs">Pounds</MenuItem>
              </TextField>
            </Grid>

            {/* Health */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Health Status"
                value={formData.health.status}
                onChange={(e) => handleNestedInputChange('health', 'status', e.target.value)}
                required
              >
                <MenuItem value="healthy">Healthy</MenuItem>
                <MenuItem value="sick">Sick</MenuItem>
                <MenuItem value="injured">Injured</MenuItem>
                <MenuItem value="quarantine">Quarantine</MenuItem>
              </TextField>
            </Grid>

            {/* Breeding */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Breeding Status"
                value={formData.breeding.status}
                onChange={(e) => handleNestedInputChange('breeding', 'status', e.target.value)}
                required
              >
                <MenuItem value="not-breeding">Not Breeding</MenuItem>
                <MenuItem value="pregnant">Pregnant</MenuItem>
                <MenuItem value="lactating">Lactating</MenuItem>
                <MenuItem value="dry">Dry</MenuItem>
              </TextField>
            </Grid>

            {/* Location */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Pasture/Location"
                value={formData.location.pasture}
                onChange={(e) => handleNestedInputChange('location', 'pasture', e.target.value)}
                required
              />
            </Grid>

            {/* Feeding */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Diet"
                value={formData.feeding.diet}
                onChange={(e) => handleNestedInputChange('feeding', 'diet', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Daily Ration"
                value={formData.feeding.dailyRation}
                onChange={(e) => handleNestedInputChange('feeding', 'dailyRation', parseFloat(e.target.value))}
                required
              />
            </Grid>

            {/* Status */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                required
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="sold">Sold</MenuItem>
                <MenuItem value="deceased">Deceased</MenuItem>
                <MenuItem value="transferred">Transferred</MenuItem>
              </TextField>
            </Grid>

            {/* Notes */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? 'Saving...' : livestock ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LivestockPage;
