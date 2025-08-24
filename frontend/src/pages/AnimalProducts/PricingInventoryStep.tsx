import React from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Typography,
  Divider
} from '@mui/material';

interface PricingInventoryStepProps {
  formData: any;
  onNestedChange: (parent: 'quantity' | 'quality' | 'production' | 'pricing' | 'inventory', field: string, value: any) => void;
  onNumberChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (e: any) => void;
  onDateChange?: (field: string, date: Date | null) => void;
}

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling' },
  { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling' },
];

const statuses = ['available', 'reserved', 'sold', 'expired', 'recalled'];

const PricingInventoryStep: React.FC<PricingInventoryStepProps> = ({
  formData,
  onNestedChange,
  onNumberChange,
  onSelectChange
}) => {
  const selectedCurrency = currencies.find(c => c.code === formData.pricing.currency) || currencies[0];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Pricing
        </Typography>
      </Grid>
      
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          fullWidth
          required
          type="number"
          label="Cost Price"
          name="pricing.costPrice"
          value={formData.pricing.costPrice}
          onChange={onNumberChange}
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {selectedCurrency.symbol}
              </InputAdornment>
            )
          }}
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          fullWidth
          required
          type="number"
          label="Selling Price"
          name="pricing.sellingPrice"
          value={formData.pricing.sellingPrice}
          onChange={onNumberChange}
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {selectedCurrency.symbol}
              </InputAdornment>
            )
          }}
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          fullWidth
          type="number"
          label="Market Price"
          name="pricing.marketPrice"
          value={formData.pricing.marketPrice}
          onChange={onNumberChange}
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {selectedCurrency.symbol}
              </InputAdornment>
            )
          }}
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={4}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Currency</InputLabel>
          <Select
            name="pricing.currency"
            value={formData.pricing.currency}
            onChange={onSelectChange}
            label="Currency"
          >
            {currencies.map(currency => (
              <MenuItem key={currency.code} value={currency.code}>
                {currency.name} ({currency.code} {currency.symbol})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={12}>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" gutterBottom>
          Inventory
        </Typography>
      </Grid>
      
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          fullWidth
          required
          type="number"
          label="Available in Stock"
          name="inventory.available"
          value={formData.inventory.available}
          onChange={onNumberChange}
          margin="normal"
          inputProps={{ min: 0 }}
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          fullWidth
          required
          type="number"
          label="Minimum Stock Level"
          name="inventory.minimumStock"
          value={formData.inventory.minimumStock}
          onChange={onNumberChange}
          margin="normal"
          inputProps={{ min: 0 }}
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          fullWidth
          required
          type="number"
          label="Reorder Point"
          name="inventory.reorderPoint"
          value={formData.inventory.reorderPoint}
          onChange={onNumberChange}
          margin="normal"
          inputProps={{ min: 0 }}
          helperText="When stock reaches this level, reorder more"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={4}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={onSelectChange}
            label="Status"
          >
            {statuses.map(status => (
              <MenuItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default PricingInventoryStep;
