import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  Inventory,
  AttachMoney,
  Agriculture,
  Warning,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { animalProductService } from '../../services/animalProductService';
import { toast } from 'react-hot-toast';

interface AnalyticsData {
  totalProducts: number;
  totalValue: number;
  lowStockCount: number;
  averagePrice: number;
  productsByType: { name: string; value: number; color: string }[];
  salesTrend: { month: string; sales: number; revenue: number }[];
  inventoryStatus: { status: string; count: number }[];
}

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch products data
      const products = await animalProductService.getAnimalProducts();
      
      // Calculate analytics
      const totalProducts = products.length;
      const totalValue = products.reduce((sum, product) => sum + (product.pricing.sellingPrice * product.inventory.available), 0);
      const lowStockCount = products.filter(product => product.inventory.available <= product.inventory.minimumStock).length;
      const averagePrice = products.length > 0 ? products.reduce((sum, product) => sum + product.pricing.sellingPrice, 0) / products.length : 0;
      
      // Group by product type
      const typeGroups = products.reduce((acc, product) => {
        acc[product.productType] = (acc[product.productType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff', '#00ffff', '#ffff00'];
      const productsByType = Object.entries(typeGroups).map(([name, value], index) => ({
        name,
        value,
        color: colors[index % colors.length]
      }));
      
      // Mock sales trend data (in real app, this would come from sales service)
      const salesTrend = [
        { month: 'Jan', sales: 120, revenue: 2400 },
        { month: 'Feb', sales: 150, revenue: 3200 },
        { month: 'Mar', sales: 180, revenue: 3800 },
        { month: 'Apr', sales: 200, revenue: 4200 },
        { month: 'May', sales: 170, revenue: 3600 },
        { month: 'Jun', sales: 220, revenue: 4800 },
      ];
      
      // Inventory status
      const inventoryStatus = [
        { status: 'Available', count: products.filter(p => p.status === 'available').length },
        { status: 'Reserved', count: products.filter(p => p.status === 'reserved').length },
        { status: 'Sold', count: products.filter(p => p.status === 'sold').length },
        { status: 'Expired', count: products.filter(p => p.status === 'expired').length },
      ];
      
      setAnalyticsData({
        totalProducts,
        totalValue,
        lowStockCount,
        averagePrice,
        productsByType,
        salesTrend,
        inventoryStatus,
      });
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load analytics');
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Analytics & Reports
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Period</InputLabel>
          <Select
            value={period}
            label="Period"
            onChange={(e) => setPeriod(e.target.value)}
          >
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="quarter">This Quarter</MenuItem>
            <MenuItem value="year">This Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Products
                  </Typography>
                  <Typography variant="h4">
                    {analyticsData?.totalProducts || 0}
                  </Typography>
                </Box>
                <Agriculture sx={{ fontSize: 40, color: 'primary.main' }} />
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
                    Total Value
                  </Typography>
                  <Typography variant="h4">
                    ${analyticsData?.totalValue?.toFixed(2) || '0.00'}
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
                    Low Stock Items
                  </Typography>
                  <Typography variant="h4" color={analyticsData?.lowStockCount ? 'error.main' : 'text.primary'}>
                    {analyticsData?.lowStockCount || 0}
                  </Typography>
                </Box>
                <Warning sx={{ fontSize: 40, color: analyticsData?.lowStockCount ? 'error.main' : 'text.secondary' }} />
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
                    Average Price
                  </Typography>
                  <Typography variant="h4">
                    ${analyticsData?.averagePrice?.toFixed(2) || '0.00'}
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: 'info.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Sales Trend Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sales Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData?.salesTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="sales" fill="#8884d8" name="Sales Count" />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue ($)" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* Product Distribution */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Products by Type
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData?.productsByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analyticsData?.productsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* Inventory Status */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Inventory Status
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analyticsData?.inventoryStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* Quick Stats */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Stats
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" justifyContent="between" alignItems="center">
                <Typography>Most Popular Product Type:</Typography>
                <Chip 
                  label={analyticsData?.productsByType[0]?.name || 'N/A'} 
                  color="primary" 
                  size="small" 
                />
              </Box>
              <Box display="flex" justifyContent="between" alignItems="center">
                <Typography>Total Product Types:</Typography>
                <Chip 
                  label={analyticsData?.productsByType.length || 0} 
                  color="secondary" 
                  size="small" 
                />
              </Box>
              <Box display="flex" justifyContent="between" alignItems="center">
                <Typography>Stock Health:</Typography>
                <Chip 
                  label={analyticsData?.lowStockCount === 0 ? 'Good' : 'Needs Attention'} 
                  color={analyticsData?.lowStockCount === 0 ? 'success' : 'warning'} 
                  size="small" 
                />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
