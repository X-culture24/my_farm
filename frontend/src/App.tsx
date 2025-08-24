import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';

// Components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedAccess from './components/RoleBasedAccess';
import ErrorFallback from './components/ErrorBoundary/ErrorFallback';

// Pages
import Landing from './pages/Landing/Landing';
import Dashboard from './pages/Dashboard/Dashboard';
import Farms from './pages/Farms/Farms';
import Livestock from './pages/Livestock/Livestock';
import AnimalProducts from './pages/AnimalProducts/AnimalProducts';
import FarmProducts from './pages/FarmProducts/FarmProducts';
import Sales from './pages/Sales/Sales';
import Analytics from './pages/Analytics/Analytics';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Profile from './pages/Profile/Profile';

// Store
import { useAuthStore } from './store/authStore';

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Green for agriculture
      light: '#4CAF50',
      dark: '#1B5E20',
    },
    secondary: {
      main: '#FF8F00', // Orange for livestock
      light: '#FFB74D',
      dark: '#F57C00',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    success: {
      main: '#4CAF50',
    },
    warning: {
      main: '#FF9800',
    },
    error: {
      main: '#F44336',
    },
  },
  typography: {
    fontFamily: '"Inter", "Poppins", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

// React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
              <Router>
                <Routes>
                  {/* Landing Page */}
                  <Route path="/" element={<Landing />} />
                  
                  {/* Public Routes */}
                  <Route path="/login" element={
                    !isAuthenticated ? <Login /> : <Navigate to="/app/dashboard" replace />
                  } />
                  <Route path="/register" element={
                    !isAuthenticated ? <Register /> : <Navigate to="/app/dashboard" replace />
                  } />

                  {/* Protected Routes */}
                  <Route path="/app" element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<Navigate to="/app/dashboard" replace />} />
                    <Route path="dashboard" element={
                      <ProtectedRoute requiredPermission={{ resource: 'analytics', action: 'read' }}>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="farms" element={
                      <ProtectedRoute requiredPermission={{ resource: 'farms', action: 'read' }}>
                        <Farms />
                      </ProtectedRoute>
                    } />
                    <Route path="livestock" element={
                      <ProtectedRoute requiredPermission={{ resource: 'livestock', action: 'read' }}>
                        <Livestock />
                      </ProtectedRoute>
                    } />
                    <Route path="animal-products" element={
                      <ProtectedRoute requiredPermission={{ resource: 'products', action: 'read' }}>
                        <AnimalProducts />
                      </ProtectedRoute>
                    } />
                    <Route path="farm-products" element={
                      <ProtectedRoute requiredPermission={{ resource: 'products', action: 'read' }}>
                        <FarmProducts />
                      </ProtectedRoute>
                    } />
                    <Route path="sales" element={
                      <ProtectedRoute requiredPermission={{ resource: 'sales', action: 'read' }}>
                        <Sales />
                      </ProtectedRoute>
                    } />
                    <Route path="analytics" element={
                      <ProtectedRoute allowedRoles={['admin', 'manager']}>
                        <Analytics />
                      </ProtectedRoute>
                    } />
                    <Route path="profile" element={<Profile />} />
                  </Route>

                  {/* Catch all route */}
                  <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
                </Routes>
              </Router>

              {/* Global Toast Notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#4CAF50',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 5000,
                    iconTheme: {
                      primary: '#F44336',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </Box>
          </ThemeProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
