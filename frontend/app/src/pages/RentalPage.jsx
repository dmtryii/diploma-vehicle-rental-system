import React, { useEffect, useState } from 'react';
import {
  Container, Box, Typography, FormControl, InputLabel, Select, MenuItem, CircularProgress, Grid, Stack
} from '@mui/material';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';
import { useAuth } from '../context/AuthContext';
import RentalCard from '../components/RentalCard';

const RentalPage = () => {
  const { authState } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [changingId, setChangingId] = useState(null);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/rentals/statuses`, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
        setStatuses(res.data.data || []);
      } catch (err) {
        setStatuses([]);
      }
    };
    fetchStatuses();
  }, [authState.token]);

  useEffect(() => {
    const fetchRentals = async () => {
      setLoading(true);
      try {
        let url = `${API_BASE_URL}/rentals`;
        if (selectedStatus) {
          url += `?status=${selectedStatus}`;
        }
        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
        setRentals(res.data.data || []);
      } catch (err) {
        setRentals([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRentals();
  }, [selectedStatus, authState.token]);

  const handleChangeStatus = async (rentalId, newStatus) => {
    setChangingId(rentalId);
    try {
      await axios.patch(
        `${API_BASE_URL}/rentals/${rentalId}/change-status?status=${newStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );
      // Оновити список після зміни статусу
      let url = `${API_BASE_URL}/rentals`;
      if (selectedStatus) {
        url += `?status=${selectedStatus}`;
      }
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      setRentals(res.data.data || []);
    } catch (err) {
      alert('Failed to change status');
    } finally {
      setChangingId(null);
    }
  };

  // Функція для форматування дати (без часу)
  const formatDateOnly = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
  };

  return (
    <Container maxWidth="md">
      <Box mt={5} mb={3} textAlign="center">
        <Typography variant="h4" component="h1" gutterBottom>
          Rentals by Status
        </Typography>
      </Box>
      <Stack direction="row" spacing={2} mb={4} justifyContent="center" alignItems="center">
        <Typography variant="subtitle1" color="text.secondary">
          Filter by status:
        </Typography>
        <FormControl sx={{ minWidth: 220 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={selectedStatus}
            label="Status"
            onChange={e => setSelectedStatus(e.target.value)}
            size="medium"
          >
            <MenuItem value="">
              <em>All statuses</em>
            </MenuItem>
            {statuses.map((status) => (
              <MenuItem key={status.value} value={status.value}>
                {status.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : rentals.length === 0 ? (
        <Typography align="center" color="text.secondary">
          No rentals found{selectedStatus ? ' for this status' : ''}.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {rentals.map((rental) => (
            <Grid item xs={12} key={rental.id}>
              <RentalCard
                rental={rental}
                statuses={statuses}
                onChangeStatus={handleChangeStatus}
                changingId={changingId}
                showStatusSelector={true}
                formatDateOnly={formatDateOnly}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default RentalPage;