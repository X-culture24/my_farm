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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert,
  Fab,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  Agriculture as AgricultureIcon,
  Terrain as TerrainIcon,
  Water as WaterIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { farmService, Farm, CreateFarmData } from '../../services/farmService';

const Farms: React.FC = () => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [farmToDelete, setFarmToDelete] = useState<Farm | null>(null);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<CreateFarmData>();

  const soilTypes = ['clay', 'loam', 'sandy', 'silt', 'peat', 'chalk', 'other'];
  const waterSources = ['rainfall', 'irrigation', 'well', 'river', 'lake', 'other'];
  const certifications = ['organic', 'fair-trade', 'rainforest-alliance', 'usda', 'eu-organic', 'other'];

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    try {
      setLoading(true);
      const farmsData = await farmService.getFarms();
      setFarms(farmsData);
    } catch (error: any) {
      toast.error('Failed to load farms');
      console.error('Error loading farms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFarm = () => {
    setEditingFarm(null);
    reset({
      name: '',
      location: {
        address: '',
        city: '',
        state: '',
        country: '',
        coordinates: { latitude: 0, longitude: 0 }
      },
      size: {
        totalAcres: 0,
        cultivatedAcres: 0,
        pastureAcres: 0
      },
      soilType: [],
      climateZone: '',
      waterSource: [],
      infrastructure: {
        irrigation: false,
        greenhouses: false,
        storage: false,
        processing: false
      },
      certifications: []
    });
    setDialogOpen(true);
  };

  const handleEditFarm = (farm: Farm) => {
    setEditingFarm(farm);
    reset({
      name: farm.name,
      location: farm.location,
      size: farm.size,
      soilType: farm.soilType,
      climateZone: farm.climateZone,
      waterSource: farm.waterSource,
      infrastructure: farm.infrastructure,
      certifications: farm.certifications
    });
    setDialogOpen(true);
  };

  const handleDeleteFarm = (farm: Farm) => {
    setFarmToDelete(farm);
    setDeleteDialogOpen(true);
  };

  const onSubmit = async (data: CreateFarmData) => {
    try {
      if (editingFarm) {
        await farmService.updateFarm(editingFarm._id, data);
        toast.success('Farm updated successfully');
      } else {
        await farmService.createFarm(data);
        toast.success('Farm created successfully');
      }
      setDialogOpen(false);
      loadFarms();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save farm');
    }
  };

  const confirmDelete = async () => {
    if (!farmToDelete) return;
    
    try {
      await farmService.deleteFarm(farmToDelete._id);
      toast.success('Farm deleted successfully');
      setDeleteDialogOpen(false);
      setFarmToDelete(null);
      loadFarms();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete farm');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'maintenance': return 'warning';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Farm Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateFarm}
        >
          Add Farm
        </Button>
      </Box>

      {farms.length === 0 ? (
        <Alert severity="info">
          No farms found. Create your first farm to get started.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {farms.map((farm) => (
            <Grid item xs={12} md={6} lg={4} key={farm._id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="h6" component="h2">
                      {farm.name}
                    </Typography>
                    <Box>
                      <IconButton size="small" onClick={() => handleEditFarm(farm)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteFarm(farm)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Chip
                    label={farm.status}
                    color={getStatusColor(farm.status) as any}
                    size="small"
                    sx={{ mb: 2 }}
                  />

                  <Box display="flex" alignItems="center" mb={1}>
                    <LocationIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {farm.location.city}, {farm.location.state}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" mb={1}>
                    <TerrainIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {farm.size.totalAcres} acres total
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" mb={2}>
                    <AgricultureIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {farm.size.cultivatedAcres} cultivated
                    </Typography>
                  </Box>

                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Soil Types:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {farm.soilType.map((soil) => (
                        <Chip key={soil} label={soil} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Infrastructure:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {farm.infrastructure.irrigation && <Chip label="Irrigation" size="small" />}
                      {farm.infrastructure.greenhouses && <Chip label="Greenhouses" size="small" />}
                      {farm.infrastructure.storage && <Chip label="Storage" size="small" />}
                      {farm.infrastructure.processing && <Chip label="Processing" size="small" />}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create/Edit Farm Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            {editingFarm ? 'Edit Farm' : 'Create New Farm'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: 'Farm name is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Farm Name"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="location.address"
                  control={control}
                  rules={{ required: 'Address is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Address"
                      error={!!errors.location?.address}
                      helperText={errors.location?.address?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="location.city"
                  control={control}
                  rules={{ required: 'City is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="City"
                      error={!!errors.location?.city}
                      helperText={errors.location?.city?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="location.state"
                  control={control}
                  rules={{ required: 'State is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="State"
                      error={!!errors.location?.state}
                      helperText={errors.location?.state?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="location.country"
                  control={control}
                  rules={{ required: 'Country is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Country"
                      error={!!errors.location?.country}
                      helperText={errors.location?.country?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Controller
                  name="size.totalAcres"
                  control={control}
                  rules={{ required: 'Total acres is required', min: 0 }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Total Acres"
                      type="number"
                      error={!!errors.size?.totalAcres}
                      helperText={errors.size?.totalAcres?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Controller
                  name="size.cultivatedAcres"
                  control={control}
                  rules={{ required: 'Cultivated acres is required', min: 0 }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Cultivated Acres"
                      type="number"
                      error={!!errors.size?.cultivatedAcres}
                      helperText={errors.size?.cultivatedAcres?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Controller
                  name="size.pastureAcres"
                  control={control}
                  rules={{ required: 'Pasture acres is required', min: 0 }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Pasture Acres"
                      type="number"
                      error={!!errors.size?.pastureAcres}
                      helperText={errors.size?.pastureAcres?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="climateZone"
                  control={control}
                  rules={{ required: 'Climate zone is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Climate Zone"
                      error={!!errors.climateZone}
                      helperText={errors.climateZone?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="soilType"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Soil Types</InputLabel>
                      <Select
                        {...field}
                        multiple
                        label="Soil Types"
                        renderValue={(selected) => (selected as string[]).join(', ')}
                      >
                        {soilTypes.map((soil) => (
                          <MenuItem key={soil} value={soil}>
                            <Checkbox checked={(field.value || []).indexOf(soil) > -1} />
                            {soil}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="waterSource"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Water Sources</InputLabel>
                      <Select
                        {...field}
                        multiple
                        label="Water Sources"
                        renderValue={(selected) => (selected as string[]).join(', ')}
                      >
                        {waterSources.map((source) => (
                          <MenuItem key={source} value={source}>
                            <Checkbox checked={(field.value || []).indexOf(source) > -1} />
                            {source}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Infrastructure
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Controller
                      name="infrastructure.irrigation"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={<Checkbox {...field} checked={field.value || false} />}
                          label="Irrigation"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Controller
                      name="infrastructure.greenhouses"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={<Checkbox {...field} checked={field.value || false} />}
                          label="Greenhouses"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Controller
                      name="infrastructure.storage"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={<Checkbox {...field} checked={field.value || false} />}
                          label="Storage"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Controller
                      name="infrastructure.processing"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={<Checkbox {...field} checked={field.value || false} />}
                          label="Processing"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingFarm ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{farmToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Farms;
