import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Chip, 
  CircularProgress, 
  Container, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  Divider, 
  FormControl, 
  IconButton, 
  InputAdornment, 
  InputLabel, 
  ListItemIcon,
  ListItemText,
  Menu, 
  MenuItem, 
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
  Select,
  alpha,
  useTheme
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Edit as EditIcon, 
  MoreVert as MoreVertIcon, 
  Refresh as RefreshIcon,
  Search as SearchIcon,
  ViewList as ViewListIcon,
  GridView as GridViewIcon
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import AnimalProductDialog from './AnimalProductDialog';
import ModernPagination from '../../components/Pagination/ModernPagination';

// Define local AnimalProduct interface
interface LocalAnimalProduct {
  _id: string;
  name: string;
  productType: 'milk' | 'eggs' | 'meat' | 'cheese' | 'butter' | 'wool' | 'honey' | 'other';
  description: string;
  quantity: {
    amount: number;
    unit: string;
  };
  quality: {
    grade: string;
    certifications: string[];
  };
  pricing: {
    costPrice: number;
    sellingPrice: number;
    currency: string;
  };
  inventory: {
    currentStock: number;
    minimumStock: number;
    location: string;
    available?: number;
  };
  status: 'active' | 'inactive' | 'out_of_stock';
  createdAt: string;
  updatedAt: string;
}

// Mock service for development
const mockAnimalProductService = {
  getAnimalProducts: async (farmId?: string) => {
    // Return mock data
    return [{
      _id: '1',
      name: 'Fresh Milk',
      productType: 'milk' as const,
      description: 'Fresh organic milk from grass-fed cows',
      quantity: {
        amount: 50,
        unit: 'liters'
      },
      quality: {
        grade: 'A',
        certifications: ['Organic', 'Grass-fed']
      },
      pricing: {
        costPrice: 2.5,
        sellingPrice: 4.0,
        currency: 'USD'
      },
      inventory: {
        currentStock: 50,
        minimumStock: 10,
        location: 'Cold Storage A',
        available: 50
      },
      status: 'active' as const,
      images: [],
      tags: ['organic', 'fresh'],
      notes: 'High quality milk from our best cows',
      farm: farmId || '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }];
  },
  
  createAnimalProduct: async (data: any) => {
    toast.success('Product created successfully!');
    return { ...data, _id: Date.now().toString() };
  },
  
  updateAnimalProduct: async (id: string, data: any) => {
    toast.success('Product updated successfully!');
    return { ...data, _id: id };
  },
  
  deleteAnimalProduct: async (id: string) => {
    toast.success('Product deleted successfully!');
  }
};

interface HeadCell {
  id: keyof LocalAnimalProduct | string;
  label: string;
  numeric: boolean;
  sortable: boolean;
}

const headCells: readonly HeadCell[] = [
  { id: 'name', numeric: false, label: 'Product Name', sortable: true },
  { id: 'productType', numeric: false, label: 'Type', sortable: true },
  { id: 'quantity', numeric: true, label: 'Quantity', sortable: true },
  { id: 'quality', numeric: false, label: 'Quality', sortable: true },
  { id: 'pricing', numeric: true, label: 'Price', sortable: true },
  { id: 'inventory', numeric: true, label: 'In Stock', sortable: true },
  { id: 'status', numeric: false, label: 'Status', sortable: true },
  { id: 'actions', numeric: false, label: 'Actions', sortable: false },
];

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'available':
      return 'success';
    case 'reserved':
      return 'warning';
    case 'sold':
      return 'info';
    case 'expired':
    case 'recalled':
      return 'error';
    default:
      return 'default';
  }
};

// Confirmation Dialog Component
const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  content,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'error',
  loading = false
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  content: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'secondary' | 'error' | 'success' | 'info' | 'warning';
  loading?: boolean;
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <Typography variant="body1">{content}</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} disabled={loading}>
        {cancelText}
      </Button>
      <Button
        onClick={onConfirm}
        color={confirmColor}
        variant="contained"
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} /> : null}
      >
        {confirmText}
      </Button>
    </DialogActions>
  </Dialog>
);

const AnimalProducts: React.FC = () => {
  const theme = useTheme();
  
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [orderBy, setOrderBy] = useState<keyof LocalAnimalProduct>('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<LocalAnimalProduct | null>(null);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animalProducts, setAnimalProducts] = useState<LocalAnimalProduct[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Mock selected farm
  const selectedFarm = { _id: '1' };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await mockAnimalProductService.getAnimalProducts(selectedFarm._id);
        setAnimalProducts(data);
      } catch (error) {
        toast.error('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [selectedFarm._id]);

  // Filter and sort data
  const filteredData = React.useMemo(() => {
    let filtered = animalProducts || [];
    
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(product => product.status === statusFilter);
    }
    
    if (typeFilter !== 'all') {
      filtered = filtered.filter(product => product.productType === typeFilter);
    }
    
    // Sort data
    filtered.sort((a, b) => {
      const aValue = a[orderBy as keyof LocalAnimalProduct] || '';
      const bValue = b[orderBy as keyof LocalAnimalProduct] || '';
      
      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    return filtered;
  }, [animalProducts, searchTerm, statusFilter, typeFilter, order, orderBy]);

  // Paginated data
  const paginatedData = React.useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  // Event handlers
  const handleRequestSort = (property: keyof LocalAnimalProduct | string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property as keyof LocalAnimalProduct);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenProductDialog = (product?: LocalAnimalProduct) => {
    setSelectedProduct(product || null);
    setProductDialogOpen(true);
  };

  const handleCloseProductDialog = () => {
    setSelectedProduct(null);
    setProductDialogOpen(false);
  };

  const handleOpenDeleteDialog = (product: LocalAnimalProduct) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setSelectedProduct(null);
    setDeleteDialogOpen(false);
  };

  const handleSubmitForm = async (formData: any) => {
    try {
      setIsSubmitting(true);
      
      if (selectedProduct) {
        await mockAnimalProductService.updateAnimalProduct(selectedProduct._id, formData);
      } else {
        await mockAnimalProductService.createAnimalProduct({
          ...formData,
          farm: selectedFarm._id
        });
      }
      setProductDialogOpen(false);
      // Reload data
      const data = await mockAnimalProductService.getAnimalProducts(selectedFarm._id);
      setAnimalProducts(data);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (selectedProduct) {
      try {
        await mockAnimalProductService.deleteAnimalProduct(selectedProduct._id);
        setDeleteDialogOpen(false);
        // Reload data
        const data = await mockAnimalProductService.getAnimalProducts(selectedFarm._id);
        setAnimalProducts(data);
      } catch (error) {
        console.error('Error deleting animal product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Animal Products
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenProductDialog()}
          size="large"
        >
          Add Product
        </Button>
      </Box>

      {/* Filters and Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="reserved">Reserved</MenuItem>
                <MenuItem value="sold">Sold</MenuItem>
                <MenuItem value="expired">Expired</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={typeFilter}
                label="Type"
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="milk">Milk</MenuItem>
                <MenuItem value="eggs">Eggs</MenuItem>
                <MenuItem value="meat">Meat</MenuItem>
                <MenuItem value="wool">Wool</MenuItem>
                <MenuItem value="honey">Honey</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box display="flex" gap={1} justifyContent="flex-end">
              <Button
                variant={viewMode === 'list' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('list')}
                startIcon={<ViewListIcon />}
              >
                List
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('grid')}
                startIcon={<GridViewIcon />}
              >
                Grid
              </Button>
              <Button
                variant="outlined"
                onClick={() => window.location.reload()}
                startIcon={<RefreshIcon />}
              >
                Refresh
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Content */}
      {viewMode === 'list' ? (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {headCells.map((headCell) => (
                    <TableCell
                      key={headCell.id as string}
                      align={headCell.numeric ? 'right' : 'left'}
                      sortDirection={orderBy === headCell.id ? order : false}
                    >
                      {headCell.sortable ? (
                        <TableSortLabel
                          active={orderBy === headCell.id}
                          direction={orderBy === headCell.id ? order : 'asc'}
                          onClick={() => handleRequestSort(headCell.id)}
                        >
                          {headCell.label}
                        </TableSortLabel>
                      ) : (
                        headCell.label
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                      <CircularProgress size={24} />
                      <Typography sx={{ mt: 1 }}>Loading animal products...</Typography>
                    </TableCell>
                  </TableRow>
                ) : paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="textSecondary">
                        {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                          ? 'No matching animal products found'
                          : 'No animal products available. Click "Add Product" to get started.'}
                      </Typography>
                      {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={() => handleOpenProductDialog()}
                          sx={{ mt: 2 }}
                        >
                          Add Product
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((row) => (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row._id}
                      sx={{ '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) } }}
                    >
                      <TableCell component="th" scope="row">
                        <Typography variant="body1" fontWeight="medium">
                          {row.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" noWrap>
                          {row.description?.substring(0, 60)}{row.description && row.description.length > 60 ? '...' : ''}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={row.productType} 
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="medium">
                          {row.quantity.amount.toLocaleString()} {row.quantity.unit}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {row.quality?.grade?.toUpperCase() || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="medium">
                          {row.pricing?.currency || 'USD'} 
                          {(row.pricing?.sellingPrice || 0).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="medium">
                          {row.inventory?.available?.toLocaleString() || row.inventory?.currentStock?.toLocaleString() || '0'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={row.status.charAt(0).toUpperCase() + row.status.slice(1)} 
                          color={getStatusColor(row.status) as any}
                          size="small"
                          sx={{ minWidth: 80, textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            setSelectedProduct(row);
                            setAnchorEl(e.currentTarget);
                          }}
                          sx={{
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.1)
                            }
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <ModernPagination
            count={filteredData.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            showNavigation={true}
            showQuickActions={true}
          />
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {isLoading ? (
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Grid>
          ) : paginatedData.length === 0 ? (
            <Grid item xs={12} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="textSecondary">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'No matching animal products found'
                  : 'No animal products available. Click "Add Product" to get started.'}
              </Typography>
              {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenProductDialog()}
                  sx={{ mt: 2 }}
                >
                  Add Product
                </Button>
              )}
            </Grid>
          ) : (
            paginatedData.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8]
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {product.description}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                      <Chip 
                        label={product.status.charAt(0).toUpperCase() + product.status.slice(1)} 
                        color={getStatusColor(product.status) as any}
                        size="small"
                      />
                      <Typography variant="h6" fontWeight="bold">
                        {product.pricing?.currency || 'USD'} {product.pricing?.sellingPrice || 0}
                      </Typography>
                    </Box>
                  </CardContent>
                  <Divider />
                  <Box p={1} display="flex" justifyContent="flex-end">
                    <Button 
                      size="small" 
                      onClick={() => handleOpenProductDialog(product)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="small" 
                      color="error"
                      onClick={() => handleOpenDeleteDialog(product)}
                    >
                      Delete
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        onClick={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => selectedProduct && handleOpenProductDialog(selectedProduct)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => selectedProduct && handleOpenDeleteDialog(selectedProduct)}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ color: 'error.main' }}>
            Delete
          </ListItemText>
        </MenuItem>
      </Menu>

      {/* Product Dialog */}
      <AnimalProductDialog
        open={productDialogOpen}
        onClose={handleCloseProductDialog}
        onSubmit={handleSubmitForm}
        product={selectedProduct as any}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        content={`Are you sure you want to delete ${selectedProduct?.name}? This action cannot be undone.`}
        confirmText="Delete"
        confirmColor="error"
        loading={isSubmitting}
      />
    </Container>
  );
};

export default AnimalProducts;
