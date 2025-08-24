import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Fade,
  Slide,
  useScrollTrigger,
  AppBar,
  Toolbar,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Agriculture,
  Pets,
  TrendingUp,
  Security,
  CloudSync,
  Analytics,
  ArrowForward,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [scrollY, setScrollY] = useState(0);
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Agriculture sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: 'Crop Management',
      description: 'Track planting, growth, and harvest cycles with precision agriculture tools.',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop'
    },
    {
      icon: <Pets sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: 'Livestock Tracking',
      description: 'Monitor animal health, breeding, and production with comprehensive records.',
      image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&h=300&fit=crop'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: 'Sales Analytics',
      description: 'Optimize revenue with detailed sales tracking and market analysis.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'
    },
    {
      icon: <Security sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: 'Data Security',
      description: 'Enterprise-grade security keeps your farm data safe and compliant.',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop'
    },
    {
      icon: <CloudSync sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: 'Cloud Sync',
      description: 'Access your data anywhere with real-time cloud synchronization.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop'
    },
    {
      icon: <Analytics sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: 'Smart Analytics',
      description: 'AI-powered insights help you make data-driven farming decisions.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop'
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Active Farms' },
    { number: '500K+', label: 'Livestock Tracked' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Navigation */}
      <AppBar 
        position="fixed" 
        elevation={trigger ? 4 : 0}
        sx={{
          bgcolor: trigger ? 'background.paper' : 'transparent',
          transition: 'all 0.3s ease',
          backdropFilter: trigger ? 'blur(10px)' : 'none',
        }}
      >
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              color: trigger ? 'text.primary' : 'white'
            }}
          >
            🌾 FarmSystem
          </Typography>
          <Button 
            color="inherit" 
            onClick={() => navigate('/login')}
            sx={{ 
              color: trigger ? 'text.primary' : 'white',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Login
          </Button>
          <Button 
            variant="contained" 
            onClick={() => navigate('/register')}
            sx={{ 
              ml: 1,
              fontFamily: 'Inter, sans-serif',
              borderRadius: 2
            }}
          >
            Get Started
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)} 0%, ${alpha(theme.palette.primary.dark, 0.8)} 100%), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&h=1080&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box>
                  <Typography
                    variant="h1"
                    component="h1"
                    sx={{
                      fontSize: { xs: '2.5rem', md: '4rem' },
                      fontWeight: 800,
                      color: 'white',
                      mb: 2,
                      fontFamily: 'Poppins, sans-serif',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                      transform: `translateY(${scrollY * 0.1}px)`,
                    }}
                  >
                    Modern Farm Management
                  </Typography>
                  <Typography
                    variant="h5"
                    component="p"
                    sx={{
                      color: alpha('#ffffff', 0.9),
                      mb: 4,
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 400,
                      lineHeight: 1.6,
                      transform: `translateY(${scrollY * 0.05}px)`,
                    }}
                  >
                    Streamline your agricultural operations with our comprehensive farm management system. 
                    Track livestock, manage crops, and optimize sales with cutting-edge technology.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForward />}
                      onClick={() => navigate('/register')}
                      sx={{
                        bgcolor: 'white',
                        color: 'primary.main',
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        borderRadius: 3,
                        '&:hover': {
                          bgcolor: alpha('#ffffff', 0.9),
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Start Free Trial
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/login')}
                      sx={{
                        borderColor: 'white',
                        color: 'white',
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        borderRadius: 3,
                        '&:hover': {
                          bgcolor: alpha('#ffffff', 0.1),
                          borderColor: 'white',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Watch Demo
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              <Slide direction="left" in timeout={1200}>
                <Box
                  sx={{
                    position: 'relative',
                    transform: `translateY(${scrollY * -0.1}px)`,
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop"
                    alt="Farm Management Dashboard"
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '16px',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    }}
                  />
                </Box>
              </Slide>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Fade in timeout={1000 + index * 200}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="h3"
                      component="div"
                      sx={{
                        fontWeight: 800,
                        color: 'primary.main',
                        fontFamily: 'Poppins, sans-serif',
                        mb: 1,
                      }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 500,
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 12, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 700,
                color: 'text.primary',
                mb: 2,
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              Everything You Need to Manage Your Farm
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                maxWidth: '600px',
                mx: 'auto',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
              }}
            >
              Comprehensive tools designed specifically for modern agricultural operations
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Fade in timeout={1000 + index * 100}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: theme.shadows[12],
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={feature.image}
                      alt={feature.title}
                      sx={{
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                      }}
                    />
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        {feature.icon}
                        <Typography
                          variant="h6"
                          component="h3"
                          sx={{
                            ml: 2,
                            fontWeight: 600,
                            fontFamily: 'Poppins, sans-serif',
                          }}
                        >
                          {feature.title}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          lineHeight: 1.6,
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 12,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            Ready to Transform Your Farm?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              opacity: 0.9,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
            }}
          >
            Join thousands of farmers who have revolutionized their operations with our platform
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            onClick={() => navigate('/register')}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              px: 6,
              py: 2,
              fontSize: '1.2rem',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              borderRadius: 3,
              '&:hover': {
                bgcolor: alpha('#ffffff', 0.9),
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Get Started Today
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 6, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontFamily: 'Poppins, sans-serif',
                }}
              >
                🌾 FarmSystem
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Empowering farmers with modern technology for sustainable agriculture.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  © 2024 FarmSystem. All rights reserved.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
