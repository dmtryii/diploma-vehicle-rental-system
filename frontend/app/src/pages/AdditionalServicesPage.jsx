import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Stack, Modal, Box, TextField } from '@mui/material';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';

const AdditionalServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [newService, setNewService] = useState({ name: '', price: '', description: '' });
  const [editingServiceId, setEditingServiceId] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/additional-services`);
        setServices(response.data.data);
      } catch (err) {
        console.error('Failed to fetch additional services:', err);
        setError('Failed to load additional services.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleEdit = (id) => {
    const serviceToEdit = services.find((service) => service.id === id);
    if (!serviceToEdit) return;
    setNewService({
      name: serviceToEdit.name || '',
      price: serviceToEdit.price || '',
      description: serviceToEdit.description || ''
    });
    setEditingServiceId(id);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this service?');
    if (confirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/additional-services/${id}`);
        setServices(services.filter((service) => service.id !== id));
      } catch (err) {
        console.error('Failed to delete service:', err);
        alert('Failed to delete service.');
      }
    }
  };

  const handleOpen = () => {
    setNewService({ name: '', price: '', description: '' });
    setEditingServiceId(null);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewService((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveService = async () => {
    if (editingServiceId) {
      try {
        const response = await axios.put(`${API_BASE_URL}/additional-services/${editingServiceId}`, newService);
        setServices((prev) =>
          prev.map((service) => (service.id === editingServiceId ? response.data.data : service))
        );
        handleClose();
      } catch (err) {
        console.error('Failed to update service:', err);
        alert('Failed to update service.');
      }
    } else {
      try {
        const response = await axios.post(`${API_BASE_URL}/additional-services`, newService);
        setServices((prev) => [...prev, response.data.data]);
        handleClose();
      } catch (err) {
        console.error('Failed to add service:', err);
        alert('Failed to add service.');
      }
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4} sx={{ mt: 4 }}>
        <Typography variant="h4">Additional Services</Typography>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add New Service
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Price</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>{service.name}</TableCell>
                <TableCell>{service.description}</TableCell>
                <TableCell>${service.price}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleEdit(service.id)}
                    sx={{ marginRight: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(service.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {editingServiceId ? 'Edit Service' : 'Add New Service'}
          </Typography>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={newService.name}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Price"
            name="price"
            type="number"
            value={newService.price}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={newService.description}
            onChange={handleInputChange}
            margin="normal"
          />
          <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSaveService}>
              {editingServiceId ? 'Save' : 'Add'}
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Container>
  );
};

export default AdditionalServicesPage;