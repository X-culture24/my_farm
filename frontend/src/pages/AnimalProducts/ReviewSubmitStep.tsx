import React from 'react';
import {
  Grid,
  Typography,
  Paper,
  Box,
  Chip,
  Divider
} from '@mui/material';
import { format } from 'date-fns';

interface ReviewSubmitStepProps {
  formData: any;
}

const ReviewSubmitStep: React.FC<ReviewSubmitStepProps> = ({ formData }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Review Your Product
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Please review all the information before submitting.
        </Typography>
      </Grid>
      
      <Grid item xs={12}>
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Basic Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2"><strong>Name:</strong> {formData.name}</Typography>
              <Typography variant="body2">
                <strong>Type:</strong> {formData.productType.charAt(0).toUpperCase() + formData.productType.slice(1)}
              </Typography>
              <Typography variant="body2">
                <strong>Batch #:</strong> {formData.production.batchNumber || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                <strong>Production Date:</strong> {format(new Date(formData.production.date), 'PP')}
              </Typography>
              <Typography variant="body2">
                <strong>Expiry Date:</strong> {format(new Date(formData.production.expiryDate), 'PP')}
              </Typography>
              <Typography variant="body2">
                <strong>Status:</strong> {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2"><strong>Description:</strong></Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontStyle: formData.description ? 'normal' : 'italic' }}>
                {formData.description || 'No description provided'}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Quantity & Quality
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                <strong>Quantity:</strong> {formData.quantity.amount} {formData.quantity.unit}
              </Typography>
              <Typography variant="body2">
                <strong>Quality Grade:</strong> {formData.quality.grade.toUpperCase()}
              </Typography>
              <Typography variant="body2">
                <strong>Processing Method:</strong> {formData.production.processingMethod.charAt(0).toUpperCase() + formData.production.processingMethod.slice(1)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                <strong>Inspection Date:</strong> {format(new Date(formData.quality.inspectionDate), 'PP')}
              </Typography>
              <Typography variant="body2">
                <strong>Inspector:</strong> {formData.quality.inspector || 'Not specified'}
              </Typography>
              <Typography variant="body2">
                <strong>Storage:</strong> {formData.production.storageConditions || 'Not specified'}
              </Typography>
            </Grid>
            {formData.quality.certification.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="body2"><strong>Certifications:</strong></Typography>
                <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                  {formData.quality.certification.map((cert: string, idx: number) => (
                    <Chip key={idx} label={cert} size="small" />
                  ))}
                </Box>
              </Grid>
            )}
          </Grid>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Pricing & Inventory
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                <strong>Cost Price:</strong> {formData.pricing.currency} {formData.pricing.costPrice.toFixed(2)}
              </Typography>
              <Typography variant="body2">
                <strong>Selling Price:</strong> {formData.pricing.currency} {formData.pricing.sellingPrice.toFixed(2)}
              </Typography>
              <Typography variant="body2">
                <strong>Market Price:</strong> {formData.pricing.currency} {formData.pricing.marketPrice?.toFixed(2) || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                <strong>In Stock:</strong> {formData.inventory.available}
              </Typography>
              <Typography variant="body2">
                <strong>Min. Stock Level:</strong> {formData.inventory.minimumStock}
              </Typography>
              <Typography variant="body2">
                <strong>Reorder Point:</strong> {formData.inventory.reorderPoint}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {(formData.tags.length > 0 || formData.images.length > 0 || formData.notes) && (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Additional Information
            </Typography>
            <Grid container spacing={2}>
              {formData.tags.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="body2"><strong>Tags:</strong></Typography>
                  <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                    {formData.tags.map((tag: string, idx: number) => (
                      <Chip key={idx} label={tag} size="small" />
                    ))}
                  </Box>
                </Grid>
              )}
              
              {formData.images.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="body2"><strong>Images ({formData.images.length}):</strong></Typography>
                  <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                    {formData.images.map((img: string, idx: number) => (
                      <Box 
                        key={idx} 
                        sx={{ 
                          width: 80, 
                          height: 80, 
                          bgcolor: 'grey.200',
                          borderRadius: 1,
                          backgroundImage: `url(${img})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          border: '1px solid #ddd'
                        }}
                      />
                    ))}
                  </Box>
                </Grid>
              )}
              
              {formData.notes && (
                <Grid item xs={12}>
                  <Typography variant="body2"><strong>Notes:</strong></Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ whiteSpace: 'pre-wrap', mt: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                    {formData.notes}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
};

export default ReviewSubmitStep;
