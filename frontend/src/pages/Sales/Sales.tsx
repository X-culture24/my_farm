import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  ShoppingCart,
  AttachMoney,
  TrendingUp,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { animalProductService, AnimalProduct } from '../../services/animalProductService';

interface Sale {
  _id: string;
  product: AnimalProduct;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  saleDate: string;
  status: 'pending' | 'completed' | 'cancelled';
  paymentMethod: 'cash' | 'card' | 'bank_transfer';
  notes?: string;
}

interface SaleFormData {
  productId: string;
  quantity: number;
  unitPrice: number;
  customerName: string;
  customerEmail: string;
  paymentMethod: string;
  notes?: string;
}

const Sales: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<AnimalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<SaleFormData>();

  const selectedProductId = watch('productId');
  const selectedProduct = products.find(p => p._id === selectedProductId);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch products
      const productsData = await animalProductService.getAnimalProducts();
      setProducts(productsData);
      
      // Mock sales data (in real app, this would come from sales service)
      const mockSales: Sale[] = [
        {
          _id: '1',
          product: productsData[0] || {} as AnimalProduct,
          quantity: 10,
          unitPrice: 25.50,
          totalAmount: 255.00,
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          saleDate: new Date().toISOString(),
          status: 'completed',
          paymentMethod: 'card',
          notes: 'Regular customer'
        },
        {
          _id: '2',
          product: productsData[1] || {} as AnimalProduct,
          quantity: 5,
          unitPrice: 15.00,
          totalAmount: 75.00,
          customerName: 'Jane Smith',
          customerEmail: 'jane@example.com',
          saleDate: new Date(Date.now() - 86400000).toISOString(),
          status: 'pending',
          paymentMethod: 'cash',
        },
      ];
      setSales(mockSales);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load data');
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (sale?: Sale) => {
    if (sale) {
      setEditingSale(sale);
      reset({
        productId: sale.product._id,
        quantity: sale.quantity,
        unitPrice: sale.unitPrice,
        customerName: sale.customerName,
        customerEmail: sale.customerEmail,
        paymentMethod: sale.paymentMethod,
        notes: sale.notes || '',
      });
    } else {
      setEditingSale(null);
      reset({
        productId: '',
        quantity: 1,
        unitPrice: 0,
        customerName: '',
        customerEmail: '',
        paymentMethod: 'cash',
        notes: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingSale(null);
    reset();
  };

  const onSubmit = async (data: SaleFormData) => {
    try {
      setSubmitting(true);
      
      const product = products.find(p => p._id === data.productId);
      if (!product) {
        toast.error('Selected product not found');
        return;
      }

      const saleData: Sale = {
        _id: editingSale?._id || `sale-${Date.now()}`,
        product,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        totalAmount: data.quantity * data.unitPrice,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        saleDate: editingSale?.saleDate || new Date().toISOString(),
        status: 'pending',
        paymentMethod: data.paymentMethod as any,
        notes: data.notes,
      };

      if (editingSale) {
        // Update existing sale
        setSales(prev => prev.map(sale => 
          sale._id === editingSale._id ? saleData : sale
        ));
        toast.success('Sale updated successfully');
      } else {
        // Add new sale
        setSales(prev => [saleData, ...prev]);
        toast.success('Sale created successfully');
      }
      
      handleCloseDialog();
    } catch (error: any) {
      toast.error('Failed to save sale');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSale = (saleId: string) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      setSales(prev => prev.filter(sale => sale._id !== saleId));
      toast.success('Sale deleted successfully');
    }
  };

  const handleUpdateStatus = (saleId: string, status: Sale['status']) => {
    setSales(prev => prev.map(sale => 
      sale._id === saleId ? { ...sale, status } : sale
    ));
    toast.success(`Sale status updated to ${status}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const totalSales = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const completedSales = sales.filter(sale => sale.status === 'completed').length;
  const pendingSales = sales.filter(sale => sale.status === 'pending').length;

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
          Sales Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          New Sale
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Sales Summary Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Sales
                  </Typography>
                  <Typography variant="h4">
                    ${totalSales.toFixed(2)}
                  </Typography>
                </Box>
                <AttachMoney sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Orders
                  </Typography>
                  <Typography variant="h4">
                    {sales.length}
                  </Typography>
                </Box>
                <ShoppingCart sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Completed
                  </Typography>
                  <Typography variant="h4">
                    {completedSales}
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: 'info.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Pending
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {pendingSales}
                  </Typography>
                </Box>
                <ShoppingCart sx={{ fontSize: 40, color: 'warning.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Sales Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Unit Price</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((sale) => (
                <TableRow key={sale._id}>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {sale.customerName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {sale.customerEmail}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{sale.product?.name || 'N/A'}</TableCell>
                  <TableCell>{sale.quantity}</TableCell>
                  <TableCell>${sale.unitPrice.toFixed(2)}</TableCell>
                  <TableCell>${sale.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip
                      label={sale.status}
                      color={getStatusColor(sale.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(sale.saleDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(sale)}
                        title="Edit"
                      >
                        <Edit />
                      </IconButton>
                      {sale.status === 'pending' && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="success"
                          onClick={() => handleUpdateStatus(sale._id, 'completed')}
                        >
                          Complete
                        </Button>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteSale(sale._id)}
                        title="Delete"
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={sales.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {sales.length === 0 && !loading && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 3 }}>
          <ShoppingCart sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No sales found
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Start by creating your first sale
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{ mt: 2 }}
          >
            New Sale
          </Button>
        </Paper>
      )}

      {/* Sale Form Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingSale ? 'Edit Sale' : 'New Sale'}
        </DialogTitle>
        
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Product</InputLabel>
                  <Select
                    {...register('productId', { required: 'Product is required' })}
                    label="Product"
                    error={!!errors.productId}
                  >
                    {products.map((product) => (
                      <MenuItem key={product._id} value={product._id}>
                        {product.name} - ${product.pricing.sellingPrice}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('quantity', {
                    required: 'Quantity is required',
                    min: { value: 1, message: 'Quantity must be at least 1' },
                  })}
                  fullWidth
                  label="Quantity"
                  type="number"
                  error={!!errors.quantity}
                  helperText={errors.quantity?.message || (selectedProduct ? `Available: ${selectedProduct.inventory.available}` : '')}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('unitPrice', {
                    required: 'Unit price is required',
                    min: { value: 0.01, message: 'Price must be positive' },
                  })}
                  fullWidth
                  label="Unit Price"
                  type="number"
                  inputProps={{ step: "0.01" }}
                  error={!!errors.unitPrice}
                  helperText={errors.unitPrice?.message}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    {...register('paymentMethod', { required: 'Payment method is required' })}
                    label="Payment Method"
                    defaultValue="cash"
                  >
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="card">Card</MenuItem>
                    <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('customerName', { required: 'Customer name is required' })}
                  fullWidth
                  label="Customer Name"
                  error={!!errors.customerName}
                  helperText={errors.customerName?.message}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('customerEmail', {
                    required: 'Customer email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  fullWidth
                  label="Customer Email"
                  type="email"
                  error={!!errors.customerEmail}
                  helperText={errors.customerEmail?.message}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  {...register('notes')}
                  fullWidth
                  label="Notes (Optional)"
                  multiline
                  rows={3}
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
            {submitting ? <CircularProgress size={20} /> : (editingSale ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sales;
