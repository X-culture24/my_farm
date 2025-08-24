import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
  Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { 
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import QuantityQualityStep from './QuantityQualityStep';
import PricingInventoryStep from './PricingInventoryStep';
import ReviewSubmitStep from './ReviewSubmitStep';
import { AnimalProduct, CreateAnimalProductData } from '../../services/animalProductService';

interface AnimalProductDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAnimalProductData) => void;
  product: AnimalProduct | null;
  isSubmitting: boolean;
}

const productTypes = ['milk', 'eggs', 'meat', 'wool', 'honey', 'cheese', 'yogurt', 'butter', 'other'];
const units = ['kg', 'lbs', 'liters', 'gallons', 'pieces', 'dozens'];
const qualityGrades = ['A', 'B', 'C', 'premium', 'standard', 'economy'];
const statuses = ['available', 'reserved', 'sold', 'expired', 'recalled'];
const processingMethods = [
  'raw',
  'pasteurized',
  'homogenized',
  'fermented',
  'aged',
  'smoked',
  'cured',
  'frozen',
  'dried',
  'other'
];

const steps = ['Basic Information', 'Quantity & Quality', 'Pricing & Inventory', 'Review & Submit'];

const AnimalProductDialog: React.FC<AnimalProductDialogProps> = ({
  open,
  onClose,
  onSubmit,
  product,
  isSubmitting
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<CreateAnimalProductData>({
    farm: '',
    livestock: '',
    productType: 'milk',
    name: '',
    description: '',
    quantity: {
      amount: 0,
      unit: 'kg'
    },
    quality: {
      grade: 'A',
      certification: [],
      inspectionDate: new Date().toISOString(),
      inspector: ''
    },
    production: {
      date: new Date().toISOString(),
      batchNumber: '',
      processingMethod: 'raw',
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      storageConditions: ''
    },
    pricing: {
      costPrice: 0,
      sellingPrice: 0,
      currency: 'USD',
      marketPrice: 0
    },
    inventory: {
      available: 0,
      minimumStock: 10,
      reorderPoint: 5
    },
    status: 'available',
    images: [],
    tags: [],
    notes: ''
  });

  // Initialize form data when product prop changes
  useEffect(() => {
    if (product) {
      setFormData({
        farm: product.farm,
        livestock: product.livestock || '',
        productType: product.productType,
        name: product.name,
        description: product.description || '',
        quantity: { ...product.quantity },
        quality: { ...product.quality },
        production: { ...product.production },
        pricing: { ...product.pricing },
        inventory: { ...product.inventory },
        status: product.status,
        images: [...(product.images || [])],
        tags: [...(product.tags || [])],
        notes: product.notes || ''
      });
    } else {
      // Reset form when opening dialog for a new product
      setFormData(prev => ({
        ...prev,
        farm: '',
        livestock: '',
        productType: 'milk',
        name: '',
        description: '',
        quantity: {
          amount: 0,
          unit: 'kg'
        },
        quality: {
          grade: 'A',
          certification: [],
          inspectionDate: new Date().toISOString(),
          inspector: ''
        },
        production: {
          date: new Date().toISOString(),
          batchNumber: '',
          processingMethod: 'raw',
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          storageConditions: ''
        },
        pricing: {
          costPrice: 0,
          sellingPrice: 0,
          currency: 'USD',
          marketPrice: 0
        },
        inventory: {
          available: 0,
          minimumStock: 10,
          reorderPoint: 5
        },
        status: 'available',
        images: [],
        tags: [],
        notes: ''
      }));
      setActiveStep(0);
    }
  }, [product, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedChange = (
    parent: 'quantity' | 'quality' | 'production' | 'pricing' | 'inventory',
    field: string,
    value: any
  ) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleDateChange = (field: string, date: Date | null) => {
    if (!date) return;
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      handleNestedChange(parent as any, child, date.toISOString());
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: date.toISOString()
      }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      handleNestedChange(parent as any, child, numValue);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: numValue
      }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      handleNestedChange(parent as any, child, value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleNext = () => {
    setActiveStep(prevStep => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };

  const renderBasicInfoStep = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          required
          label="Product Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Product Type</InputLabel>
          <Select
            name="productType"
            value={formData.productType}
            onChange={handleSelectChange}
            label="Product Type"
          >
            {productTypes.map(type => (
              <MenuItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={3}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Batch Number"
          name="production.batchNumber"
          value={formData.production.batchNumber}
          onChange={handleChange}
          margin="normal"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Production Date"
            value={new Date(formData.production.date)}
            onChange={(date) => handleDateChange('production.date', date)}
            slots={{
              textField: TextField
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: 'normal'
              }
            }}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Processing Method</InputLabel>
          <Select
            name="production.processingMethod"
            value={formData.production.processingMethod}
            onChange={handleSelectChange}
            label="Processing Method"
          >
            {processingMethods.map(method => (
              <MenuItem key={method} value={method}>
                {method.charAt(0).toUpperCase() + method.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );

  const renderStepContent = (step: number) => {
    const commonProps = {
      formData,
      onNestedChange: handleNestedChange,
      onDateChange: handleDateChange,
      onNumberChange: handleNumberChange,
      onSelectChange: handleSelectChange
    };

    switch (step) {
      case 0:
        return renderBasicInfoStep();
      case 1:
        return <QuantityQualityStep {...commonProps} />;
      case 2:
        return <PricingInventoryStep {...commonProps} />;
      case 3:
        return <ReviewSubmitStep formData={formData} />;
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      aria-labelledby="animal-product-dialog-title"
    >
      <DialogTitle id="animal-product-dialog-title">
        {product ? 'Edit Animal Product' : 'Add New Animal Product'}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box mt={2}>
          <form onSubmit={handleSubmit}>
            {renderStepContent(activeStep)}
            
            <Box mt={4} display="flex" justifyContent="space-between" sx={{ pt: 2 }}>
              <Button
                disabled={activeStep === 0 || isSubmitting}
                onClick={handleBack}
                startIcon={<ArrowBackIcon />}
              >
                Back
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
                >
                  {isSubmitting ? 'Saving...' : 'Save Product'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  endIcon={<ArrowForwardIcon />}
                >
                  Next
                </Button>
              )}
            </Box>
          </form>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AnimalProductDialog;
