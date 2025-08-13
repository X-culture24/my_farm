import React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { Error as ErrorIcon, Refresh as RefreshIcon } from '@mui/icons-material';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 3,
        bgcolor: 'background.default',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 500,
          textAlign: 'center',
          borderRadius: 3,
        }}
      >
        <ErrorIcon
          sx={{
            fontSize: 80,
            color: 'error.main',
            mb: 2,
          }}
        />
        
        <Typography variant="h4" component="h1" gutterBottom color="error.main">
          Oops! Something went wrong
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
        </Typography>

        {process.env.NODE_ENV === 'development' && (
          <Paper
            sx={{
              p: 2,
              mb: 3,
              bgcolor: 'grey.100',
              textAlign: 'left',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              maxHeight: 200,
              overflow: 'auto',
            }}
          >
            <Typography variant="subtitle2" gutterBottom>
              Error Details:
            </Typography>
            <Typography variant="body2" component="pre" sx={{ m: 0 }}>
              {error.message}
            </Typography>
            {error.stack && (
              <Typography variant="body2" component="pre" sx={{ m: 0, mt: 1 }}>
                {error.stack}
              </Typography>
            )}
          </Paper>
        )}

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={resetErrorBoundary}
            size="large"
          >
            Try Again
          </Button>
          
          <Button
            variant="outlined"
            onClick={() => window.location.href = '/'}
            size="large"
          >
            Go Home
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ErrorFallback;
