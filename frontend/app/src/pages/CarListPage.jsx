import React, { useEffect, useState } from 'react';
import { Grid, Container, TextField, Box, Typography, IconButton, Collapse, CircularProgress } from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';
import CarCard from '../components/CarCard';
import AddNewCarCard from '../components/AddNewCarCard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import debounce from 'lodash.debounce';

const CarListPage = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { authState } = useAuth();
  const navigate = useNavigate();

  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedBodyType, setSelectedBodyType] = useState('');
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const [selectedTransmissionType, setSelectedTransmissionType] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');

  const [statuses, setStatuses] = useState([]);
  const [colors, setColors] = useState([]);
  const [bodyTypes, setBodyTypes] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [transmissionTypes, setTransmissionTypes] = useState([]);

  const fetchCars = async (filters = {}) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/vehicles`, {
        params: { ...filters },
      });
      setCars(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const [
          statusesRes,
          colorsRes,
          bodyTypesRes,
          manufacturersRes,
          transmissionTypesRes,
        ] = await Promise.all([
          axios.get(`${API_BASE_URL}/vehicles/statuses`),
          axios.get(`${API_BASE_URL}/vehicles/colors`),
          axios.get(`${API_BASE_URL}/vehicles/body-types`),
          axios.get(`${API_BASE_URL}/manufacturers`),
          axios.get(`${API_BASE_URL}/vehicles/transmission-types`),
        ]);

        setStatuses(statusesRes.data.data);
        setColors(colorsRes.data.data);
        setBodyTypes(bodyTypesRes.data.data);
        setManufacturers(manufacturersRes.data.data);
        setTransmissionTypes(transmissionTypesRes.data.data);
      } catch (err) {
        console.error('Failed to fetch attributes:', err);
      }
    };

    fetchAttributes();
  }, []);

  useEffect(() => {
    const debouncedFetch = debounce(() => {
      fetchCars({
        name: searchTerm,
        status: selectedStatus,
        color: selectedColor,
        bodyType: selectedBodyType,
        manufacturer: selectedManufacturer,
        transmissionType: selectedTransmissionType,
        priceMin: priceMin || undefined,
        priceMax: priceMax || undefined,
      });
    }, 500);

    debouncedFetch();

    return () => debouncedFetch.cancel();
  }, [
    searchTerm,
    selectedStatus,
    selectedColor,
    selectedBodyType,
    selectedManufacturer,
    selectedTransmissionType,
    priceMin,
    priceMax,
  ]);

  const handleDelete = async (carId) => {
    const confirmed = window.confirm("Are you sure you want to delete this car?");
    if (confirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/vehicles/${carId}`);
        setCars(cars.filter((car) => car.id !== carId));
      } catch (err) {
        console.error('Failed to delete car:', err);
        setError(err);
      }
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography color="error" variant="h6">
          Error: {error.message}
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 3 } }}>
      <Box
        sx={{
          width: '100%',
          minHeight: 220,
          background: 'linear-gradient(90deg, #1976d2 60%, #fff 100%)',
          borderRadius: 4,
          mb: 1.5, // Зменшено margin-bottom
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          boxShadow: 3,
          position: 'relative',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Box sx={{ flex: 1, p: { xs: 2, md: 4 } }}>
          <Typography variant="h3" color="white" fontWeight={700} gutterBottom>
            Find your perfect ride!
          </Typography>
          <Typography variant="h6" color="white" sx={{ opacity: 0.9 }}>
            Fast. Easy. Reliable. Rent the car you want in seconds.
          </Typography>
          <Box mt={2} display="flex" alignItems="center" gap={2}>
            <TextField
              fullWidth
              label="Search by name"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                bgcolor: 'white',
                borderRadius: 2,
                minWidth: { xs: 120, md: 300 },
                boxShadow: 1,
              }}
            />
            <IconButton
              onClick={() => setFiltersOpen(!filtersOpen)}
              color="primary"
              sx={{
                bgcolor: 'white',
                borderRadius: 2,
                boxShadow: 1,
                '&:hover': { bgcolor: 'grey.100' },
              }}
            >
              <FilterListIcon fontSize="large" />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Collapse in={filtersOpen}>
        <Box display="flex" flexWrap="wrap" gap={2} mb={2} mt={1}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="">All</MenuItem>
              {statuses.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Color</InputLabel>
            <Select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              label="Color"
            >
              <MenuItem value="">All</MenuItem>
              {colors.map((color) => (
                <MenuItem key={color.value} value={color.value}>
                  {color.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Body Type</InputLabel>
            <Select
              value={selectedBodyType}
              onChange={(e) => setSelectedBodyType(e.target.value)}
              label="Body Type"
            >
              <MenuItem value="">All</MenuItem>
              {bodyTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Manufacturer</InputLabel>
            <Select
              value={selectedManufacturer}
              onChange={(e) => setSelectedManufacturer(e.target.value)}
              label="Manufacturer"
            >
              <MenuItem value="">All</MenuItem>
              {manufacturers.map((manufacturer) => (
                <MenuItem key={manufacturer.id} value={manufacturer.id}>
                  {manufacturer.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Transmission Type</InputLabel>
            <Select
              value={selectedTransmissionType}
              onChange={(e) => setSelectedTransmissionType(e.target.value)}
              label="Transmission Type"
            >
              <MenuItem value="">All</MenuItem>
              {transmissionTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box display="flex" gap={2} mt={2}>
            <TextField
              label="Min Price"
              type="number"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              variant="outlined"
              sx={{ minWidth: 100 }}
            />
            <TextField
              label="Max Price"
              type="number"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              variant="outlined"
              sx={{ minWidth: 100 }}
            />
          </Box>
        </Box>
      </Collapse>

      <Grid container spacing={3} mt={1}>
        {authState.user && authState.user.roles.some(role => role.name === 'ROLE_MANAGER') && (
          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 6,
                },
                height: '100%',
              }}
            >
              <AddNewCarCard action={() => navigate('/add-car')} />
            </Box>
          </Grid>
        )}

        {cars.map((car) => (
          <Grid item key={car.id} xs={12} sm={6} md={4}>
            <Box
              sx={{
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 6,
                },
                height: '100%',
              }}
            >
              <CarCard
                car={car}
                onDelete={handleDelete}
                onEdit={() => navigate(`/edit-car/${car.id}`)}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CarListPage;