import React from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  FirstPage,
  LastPage,
  NavigateBefore,
  NavigateNext,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface ModernPaginationProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  showNavigation?: boolean;
  showQuickActions?: boolean;
}

const ModernPagination: React.FC<ModernPaginationProps> = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  showNavigation = true,
  showQuickActions = true,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const totalPages = Math.ceil(count / rowsPerPage);
  const startItem = page * rowsPerPage + 1;
  const endItem = Math.min((page + 1) * rowsPerPage, count);

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, totalPages - 1));
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
        p: 2,
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Left Section - Items Info & Navigation */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="body2" color="text.secondary">
          Showing {startItem}-{endItem} of {count} items
        </Typography>

        {showNavigation && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate('/login')}
              startIcon={<LoginIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate('/register')}
              startIcon={<RegisterIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                background: 'linear-gradient(45deg, #2E7D32 30%, #4CAF50 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1B5E20 30%, #388E3C 90%)',
                },
              }}
            >
              Register
            </Button>
          </Box>
        )}
      </Box>

      {/* Center Section - Page Navigation */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          size="small"
          sx={{
            borderRadius: 1.5,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          <FirstPage />
        </IconButton>

        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          size="small"
          sx={{
            borderRadius: 1.5,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          <NavigateBefore />
        </IconButton>

        {/* Page Numbers */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {getVisiblePages().map((pageNum, index) => (
            <React.Fragment key={index}>
              {pageNum === '...' ? (
                <Typography variant="body2" sx={{ px: 1 }}>
                  ...
                </Typography>
              ) : (
                <Chip
                  label={pageNum}
                  variant={page + 1 === pageNum ? 'filled' : 'outlined'}
                  color={page + 1 === pageNum ? 'primary' : 'default'}
                  size="small"
                  clickable
                  onClick={(event) => onPageChange(event, (pageNum as number) - 1)}
                  sx={{
                    minWidth: 32,
                    height: 32,
                    borderRadius: 1.5,
                    fontWeight: page + 1 === pageNum ? 600 : 400,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </Box>

        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= totalPages - 1}
          size="small"
          sx={{
            borderRadius: 1.5,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          <NavigateNext />
        </IconButton>

        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= totalPages - 1}
          size="small"
          sx={{
            borderRadius: 1.5,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          <LastPage />
        </IconButton>
      </Box>

      {/* Right Section - Rows Per Page */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {showQuickActions && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label="Quick View"
              variant="outlined"
              size="small"
              clickable
              sx={{
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.info.main, 0.1),
                },
              }}
            />
            <Chip
              label="Export"
              variant="outlined"
              size="small"
              clickable
              sx={{
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                },
              }}
            />
          </Box>
        )}

        <FormControl size="small" sx={{ minWidth: 80 }}>
          <InputLabel>Rows</InputLabel>
          <Select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange({ target: { value: e.target.value } } as React.ChangeEvent<HTMLInputElement>)}
            label="Rows"
            sx={{
              borderRadius: 2,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: alpha(theme.palette.divider, 0.3),
              },
            }}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default ModernPagination;
