import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
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
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Agriculture,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { animalProductService, AnimalProduct, CreateAnimalProductData } from '../../services/animalProductService';

interface ProductFormData {
  name: string;
  description: string;
  productType: string;
  quantity: {
    amount: number;
    unit: string;
  };
  pricing: {
    costPrice: number;
    sellingPrice: number;
    currency: string;
  };
  inventory: {
    available: number;
    minimumStock: number;
    reorderPoint: number;
  };
}

const FarmProducts: React.FC = () => {
  const [products, setProducts] = useState<AnimalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AnimalProduct | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const productsData = await animalProductService.getAnimalProducts();
      setProducts(productsData);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load products');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (product?: AnimalProduct) => {
    if (product) {
      setEditingProduct(product);
      reset({
        name: product.name,
        description: product.description,
        productType: product.productType,
        quantity: {
          amount: product.quantity.amount,
          unit: product.quantity.unit,
        },
        pricing: {
          costPrice: product.pricing.costPrice,
          sellingPrice: product.pricing.sellingPrice,
          currency: product.pricing.currency,
        },
        inventory: {
          available: product.inventory.available,
          minimumStock: product.inventory.minimumStock,
          reorderPoint: product.inventory.reorderPoint,
        },
      });
    } else {
      setEditingProduct(null);
      reset({
        name: '',
        description: '',
        productType: 'milk',
        quantity: { amount: 0, unit: 'kg' },
        pricing: { costPrice: 0, sellingPrice: 0, currency: 'USD' },
        inventory: { available: 0, minimumStock: 10, reorderPoint: 20 },
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProduct(null);
    reset();
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setSubmitting(true);
      
      const productData: CreateAnimalProductData = {
        farm: 'default-farm-id', // This should come from user context
        name: data.name,
        description: data.description,
        productType: data.productType as any,
        quantity: {
          amount: data.quantity.amount,
          unit: data.quantity.unit as 'kg' | 'lbs' | 'liters' | 'gallons' | 'pieces' | 'dozens'
        },
        quality: {
          grade: 'A',
          certification: [],
          inspectionDate: new Date().toISOString(),
          inspector: 'System',
        },
        production: {
          date: new Date().toISOString(),
          batchNumber: `BATCH-${Date.now()}`,
          processingMethod: 'Standard',
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          storageConditions: 'Cool and dry place',
        },
        pricing: data.pricing,
        inventory: data.inventory,
        status: 'available',
      };

      if (editingProduct) {
        await animalProductService.updateAnimalProduct(editingProduct._id, productData);
        toast.success('Product updated successfully');
      } else {
        await animalProductService.createAnimalProduct(productData);
        toast.success('Product created successfully');
      }
      
      handleCloseDialog();
      fetchProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await animalProductService.deleteAnimalProduct(productId);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'success';
      case 'reserved': return 'warning';
      case 'sold': return 'info';
      case 'expired': return 'error';
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
    <Box p={3}>
      <Box display="flex" justifyContent="between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Farm Products Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Product
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} action={
          <Button color="inherit" size="small" onClick={fetchProducts}>
            Retry
          </Button>
        }>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="between" alignItems="start" mb={2}>
                  <Typography variant="h6" component="h3">
                    {product.name}
                  </Typography>
                  <Chip
                    label={product.status}
                    color={getStatusColor(product.status) as any}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {product.description}
                </Typography>
                
                <Box mt={2}>
                  <Typography variant="body2">
                    <strong>Type:</strong> {product.productType}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Quantity:</strong> {product.quantity.amount} {product.quantity.unit}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Price:</strong> ${product.pricing.sellingPrice}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Available:</strong> {product.inventory.available}
                  </Typography>
                  {product.inventory.available <= product.inventory.minimumStock && (
                    <Chip
                      label="Low Stock"
                      color="warning"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  )}
                </Box>
              </CardContent>
              
              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => handleOpenDialog(product)}
                  title="Edit"
                >
                  <Edit />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteProduct(product._id)}
                  title="Delete"
                  color="error"
                >
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {products.length === 0 && !loading && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 3 }}>
          <Agriculture sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No products found
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Start by adding your first farm product
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{ mt: 2 }}
          >
            Add Product
          </Button>
        </Paper>
      )}

      {/* Product Form Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('name', { required: 'Product name is required' })}
                  fullWidth
                  label="Product Name"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Product Type</InputLabel>
                  <Select
                    {...register('productType', { required: 'Product type is required' })}
                    label="Product Type"
                    defaultValue="milk"
                  >
                    <MenuItem value="milk">Milk</MenuItem>
                    <MenuItem value="eggs">Eggs</MenuItem>
                    <MenuItem value="meat">Meat</MenuItem>
                    <MenuItem value="wool">Wool</MenuItem>
                    <MenuItem value="honey">Honey</MenuItem>
                    <MenuItem value="cheese">Cheese</MenuItem>
                    <MenuItem value="yogurt">Yogurt</MenuItem>
                    <MenuItem value="butter">Butter</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  {...register('description')}
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('quantity.amount', {
                    required: 'Quantity is required',
                    min: { value: 0, message: 'Quantity must be positive' },
                  })}
                  fullWidth
                  label="Quantity"
                  type="number"
                  error={!!errors.quantity?.amount}
                  helperText={errors.quantity?.amount?.message}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Unit</InputLabel>
                  <Select
                    {...register('quantity.unit', { required: 'Unit is required' })}
                    label="Unit"
                    defaultValue="kg"
                  >
                    <MenuItem value="kg">Kilograms</MenuItem>
                    <MenuItem value="lbs">Pounds</MenuItem>
                    <MenuItem value="liters">Liters</MenuItem>
                    <MenuItem value="gallons">Gallons</MenuItem>
                    <MenuItem value="pieces">Pieces</MenuItem>
                    <MenuItem value="dozens">Dozens</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('pricing.costPrice', {
                    required: 'Cost price is required',
                    min: { value: 0, message: 'Price must be positive' },
                  })}
                  fullWidth
                  label="Cost Price"
                  type="number"
                  inputProps={{ step: "0.01" }}
                  error={!!errors.pricing?.costPrice}
                  helperText={errors.pricing?.costPrice?.message}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('pricing.sellingPrice', {
                    required: 'Selling price is required',
                    min: { value: 0, message: 'Price must be positive' },
                  })}
                  fullWidth
                  label="Selling Price"
                  type="number"
                  inputProps={{ step: "0.01" }}
                  error={!!errors.pricing?.sellingPrice}
                  helperText={errors.pricing?.sellingPrice?.message}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  {...register('inventory.available', {
                    required: 'Available quantity is required',
                    min: { value: 0, message: 'Quantity must be positive' },
                  })}
                  fullWidth
                  label="Available Stock"
                  type="number"
                  error={!!errors.inventory?.available}
                  helperText={errors.inventory?.available?.message}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  {...register('inventory.minimumStock', {
                    required: 'Minimum stock is required',
                    min: { value: 0, message: 'Quantity must be positive' },
                  })}
                  fullWidth
                  label="Minimum Stock"
                  type="number"
                  error={!!errors.inventory?.minimumStock}
                  helperText={errors.inventory?.minimumStock?.message}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  {...register('inventory.reorderPoint', {
                    required: 'Reorder point is required',
                    min: { value: 0, message: 'Quantity must be positive' },
                  })}
                  fullWidth
                  label="Reorder Point"
                  type="number"
                  error={!!errors.inventory?.reorderPoint}
                  helperText={errors.inventory?.reorderPoint?.message}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={20} /> : (editingProduct ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FarmProducts;
