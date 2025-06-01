import React, { useEffect, useState } from 'react';
import {
  Container, Box, Typography, FormControl, InputLabel, Select, MenuItem, CircularProgress, Grid, Stack, Paper, Button, Collapse, Divider
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
  const [openContacts, setOpenContacts] = useState({});

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

  // Відображення контактів користувача
  const UserContacts = ({ user }) => (
    <Paper variant="outlined" sx={{ p: 2, mb: 2, background: "#f9f9f9" }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        User Contacts
      </Typography>
      <Typography variant="body2"><strong>Username:</strong> {user.username}</Typography>
      <Typography variant="body2"><strong>Email:</strong> {user.email}</Typography>
      <Typography variant="body2"><strong>Name:</strong> {user.firstName} {user.lastName}</Typography>
      <Typography variant="body2"><strong>Gender:</strong> {user.gender}</Typography>
      <Typography variant="body2"><strong>Birthday:</strong> {user.birthday}</Typography>
    </Paper>
  );

  const handleToggleContacts = (rentalId) => {
    setOpenContacts((prev) => ({
      ...prev,
      [rentalId]: !prev[rentalId],
    }));
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
          {rentals.map((rental, idx) => (
            <React.Fragment key={rental.id}>
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
                  <RentalCard
                    rental={rental}
                    statuses={statuses}
                    onChangeStatus={handleChangeStatus}
                    changingId={changingId}
                    showStatusSelector={true}
                    formatDateOnly={formatDateOnly}
                    showContacts={!!openContacts[rental.id]}
                    onToggleContacts={() => handleToggleContacts(rental.id)}
                  />
                  <Collapse in={!!openContacts[rental.id]}>
                    <UserContacts user={rental.user} />
                  </Collapse>
                </Paper>
              </Grid>
              {idx < rentals.length - 1 && (
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
              )}
            </React.Fragment>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default RentalPage;