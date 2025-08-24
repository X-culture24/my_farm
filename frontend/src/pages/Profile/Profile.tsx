import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Avatar,
  CircularProgress,
  Alert,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import { Person, Edit, Save, Cancel } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { authService, UserProfile as UserProfileType } from '../../services/authService';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const profileData = await authService.getProfile();
      setProfile(profileData);
      reset({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
      });
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load profile');
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setUpdating(true);
      const updatedProfile = await authService.updateProfile(data);
      setProfile(updatedProfile);
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
      });
    }
    setEditing(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error && !profile) {
    return (
      <Box p={3}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={fetchProfile}>
            Retry
          </Button>
        }>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Info Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '3rem',
                }}
              >
                <Person fontSize="inherit" />
              </Avatar>
              <Typography variant="h6" gutterBottom>
                {profile?.firstName} {profile?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {profile?.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Role: {profile?.role}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Form */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="between" alignItems="center" mb={3}>
              <Typography variant="h6">
                Profile Information
              </Typography>
              {!editing && (
                <Button
                  startIcon={<Edit />}
                  variant="outlined"
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </Button>
              )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...register('firstName', {
                      required: 'First name is required',
                      minLength: {
                        value: 2,
                        message: 'First name must be at least 2 characters',
                      },
                    })}
                    fullWidth
                    label="First Name"
                    disabled={!editing || updating}
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    {...register('lastName', {
                      required: 'Last name is required',
                      minLength: {
                        value: 2,
                        message: 'Last name must be at least 2 characters',
                      },
                    })}
                    fullWidth
                    label="Last Name"
                    disabled={!editing || updating}
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    fullWidth
                    label="Email Address"
                    type="email"
                    disabled={!editing || updating}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Role"
                    value={profile?.role || ''}
                    disabled
                    helperText="Role cannot be changed"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Member Since"
                    value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : ''}
                    disabled
                  />
                </Grid>
              </Grid>

              {editing && (
                <Box mt={3} display="flex" gap={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    disabled={updating || !isDirty}
                  >
                    {updating ? <CircularProgress size={20} /> : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                    disabled={updating}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
