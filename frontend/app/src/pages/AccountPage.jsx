import { useEffect, useState } from 'react';
import { Container, Box, Typography, Grid } from '@mui/material';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';
import { useAuth } from '../context/AuthContext';
import RentalCard from '../components/RentalCard';

const AccountPage = () => {
  const { authState } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/rentals/personal`, {
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
  }, [authState.token]);

  const formatDateOnly = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
  };

  return (
    <Container maxWidth="md">
      <Box mt={5} mb={3} textAlign="center">
        <Typography variant="h4" component="h1" gutterBottom>
          My Rentals
        </Typography>
      </Box>
      {loading ? (
        <Typography align="center">Loading...</Typography>
      ) : rentals.length === 0 ? (
        <Typography align="center" color="text.secondary">
          You have no rentals yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {rentals.map((rental) => (
            <Grid item xs={12} key={rental.id}>
              <RentalCard
                rental={rental}
                formatDateOnly={formatDateOnly}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default AccountPage;