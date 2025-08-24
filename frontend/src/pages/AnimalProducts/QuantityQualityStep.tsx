import React from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
  Button,
  InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Add as AddIcon } from '@mui/icons-material';

interface QuantityQualityStepProps {
  formData: any;
  onNestedChange: (parent: 'quantity' | 'quality' | 'production' | 'pricing' | 'inventory', field: string, value: any) => void;
  onDateChange: (field: string, date: Date | null) => void;
  onNumberChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (e: any) => void;
}

const units = ['kg', 'lbs', 'liters', 'gallons', 'pieces', 'dozens'];
const qualityGrades = ['A', 'B', 'C', 'premium', 'standard', 'economy'];

const QuantityQualityStep: React.FC<QuantityQualityStepProps> = ({
  formData,
  onNestedChange,
  onDateChange,
  onNumberChange,
  onSelectChange
}) => {
  const [certificationInput, setCertificationInput] = React.useState('');

  const addCertification = () => {
    if (certificationInput.trim() && !formData.quality.certification.includes(certificationInput)) {
      onNestedChange('quality', 'certification', [
        ...formData.quality.certification,
        certificationInput.trim()
      ]);
      setCertificationInput('');
    }
  };

  const removeCertification = (cert: string) => {
    onNestedChange(
      'quality',
      'certification',
      formData.quality.certification.filter((c: string) => c !== cert)
    );
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          required
          type="number"
          label="Quantity"
          name="quantity.amount"
          value={formData.quantity.amount}
          onChange={onNumberChange}
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Select
                  value={formData.quantity.unit}
                  onChange={(e) => onNestedChange('quantity', 'unit', e.target.value)}
                  size="small"
                  variant="standard"
                  disableUnderline
                >
                  {units.map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </Select>
              </InputAdornment>
            )
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Quality Grade</InputLabel>
          <Select
            name="quality.grade"
            value={formData.quality.grade}
            onChange={onSelectChange}
            label="Quality Grade"
          >
            {qualityGrades.map((grade) => (
              <MenuItem key={grade} value={grade}>
                {grade.toUpperCase()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Box mb={2}>
          <Typography variant="subtitle2" gutterBottom>
            Certifications
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap" mb={1}>
            {formData.quality.certification.map((cert: string, index: number) => (
              <Chip
                key={index}
                label={cert}
                onDelete={() => removeCertification(cert)}
                size="small"
              />
            ))}
          </Box>
          <Box display="flex" gap={1}>
            <TextField
              size="small"
              placeholder="Add certification"
              value={certificationInput}
              onChange={(e) => setCertificationInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
            />
            <Button
              variant="outlined"
              size="small"
              onClick={addCertification}
              startIcon={<AddIcon />}
            >
              Add
            </Button>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Inspection Date"
            value={new Date(formData.quality.inspectionDate)}
            onChange={(date) => onDateChange('quality.inspectionDate', date)}
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
        <TextField
          fullWidth
          label="Inspector"
          name="quality.inspector"
          value={formData.quality.inspector}
          onChange={(e) => onNestedChange('quality', 'inspector', e.target.value)}
          margin="normal"
        />
      </Grid>
      <Grid item xs={12}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Expiry Date"
            value={new Date(formData.production.expiryDate)}
            onChange={(date) => onDateChange('production.expiryDate', date)}
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
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Storage Conditions"
          name="production.storageConditions"
          value={formData.production.storageConditions}
          onChange={(e) => onNestedChange('production', 'storageConditions', e.target.value)}
          margin="normal"
          placeholder="e.g., Keep refrigerated at 4°C"
        />
      </Grid>
    </Grid>
  );
};

export default QuantityQualityStep;
