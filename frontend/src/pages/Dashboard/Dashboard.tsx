import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Agriculture,
  Pets,
  LocalDining,
  Eco,
  ShoppingCart,
  TrendingUp,
  Notifications,
  Add,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useAuthStore } from '@/store/authStore';

// Mock data for demonstration
const salesData = [
  { month: 'Jan', sales: 4000, products: 2400 },
  { month: 'Feb', sales: 3000, products: 1398 },
  { month: 'Mar', sales: 2000, products: 9800 },
  { month: 'Apr', sales: 2780, products: 3908 },
  { month: 'May', sales: 1890, products: 4800 },
  { month: 'Jun', sales: 2390, products: 3800 },
];

const productDistribution = [
  { name: 'Milk', value: 35, color: '#4CAF50' },
  { name: 'Eggs', value: 25, color: '#FF9800' },
  { name: 'Vegetables', value: 20, color: '#2196F3' },
  { name: 'Grains', value: 20, color: '#9C27B0' },
];

const recentActivities = [
  { id: 1, type: 'sale', message: 'New sale recorded for Farm A', time: '2 hours ago', farm: 'Farm A' },
  { id: 2, type: 'product', message: 'Animal product inventory updated', time: '4 hours ago', farm: 'Farm B' },
  { id: 3, type: 'livestock', message: 'New livestock added to Farm C', time: '6 hours ago', farm: 'Farm C' },
  { id: 4, type: 'notification', message: 'Weather alert for Farm A', time: '8 hours ago', farm: 'Farm A' },
];

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return <ShoppingCart color="primary" />;
      case 'product':
        return <LocalDining color="secondary" />;
      case 'livestock':
        return <Pets color="success" />;
      case 'notification':
        return <Notifications color="warning" />;
      default:
        return <Agriculture color="info" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'sale':
        return 'primary';
      case 'product':
        return 'secondary';
      case 'livestock':
        return 'success';
      case 'notification':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <Box>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {user?.firstName || 'Farmer'}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening on your farms today
        </Typography>
      </Box>

      {/* Quick Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Total Farms
                  </Typography>
                  <Typography variant="h4" component="div">
                    {user?.farms?.length || 0}
                  </Typography>
                </Box>
                <Agriculture sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Active Livestock
                  </Typography>
                  <Typography variant="h4" component="div">
                    127
                  </Typography>
                </Box>
                <Pets sx={{ fontSize: 40, color: 'secondary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Products Available
                  </Typography>
                  <Typography variant="h4" component="div">
                    89
                  </Typography>
                </Box>
                <LocalDining sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Monthly Sales
                  </Typography>
                  <Typography variant="h4" component="div">
                    $12.5K
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: 'info.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts and Analytics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Sales Trend Chart */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sales Trend (Last 6 Months)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke={theme.palette.primary.main} strokeWidth={2} />
                  <Line type="monotone" dataKey="products" stroke={theme.palette.secondary.main} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Product Distribution */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Product Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={productDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {productDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions and Recent Activities */}
      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => navigate('/farms')}
                  fullWidth
                >
                  Add New Farm
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Pets />}
                  onClick={() => navigate('/livestock')}
                  fullWidth
                >
                  Add Livestock
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<LocalDining />}
                  onClick={() => navigate('/animal-products')}
                  fullWidth
                >
                  Record Product
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ShoppingCart />}
                  onClick={() => navigate('/sales')}
                  fullWidth
                >
                  Create Sale
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <List>
                {recentActivities.map((activity) => (
                  <ListItem key={activity.id} divider>
                    <ListItemIcon>
                      {getActivityIcon(activity.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.message}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Chip
                            label={activity.farm}
                            size="small"
                            color={getActivityColor(activity.type) as any}
                            variant="outlined"
                          />
                          <Typography variant="caption" color="text.secondary">
                            {activity.time}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
