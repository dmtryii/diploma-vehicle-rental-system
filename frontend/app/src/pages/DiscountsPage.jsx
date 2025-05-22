import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Stack, Modal, Box, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';

const DiscountsPage = () => {
    const [discounts, setDiscounts] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [newDiscount, setNewDiscount] = useState({ name: '', amount: '', startDate: '', endDate: '', userIds: [] });
    const [editingDiscountId, setEditingDiscountId] = useState(null);

    useEffect(() => {
        const fetchDiscounts = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/discounts`);
                setDiscounts(response.data.data);
            } catch (err) {
                console.error('Failed to fetch discounts:', err);
                setError('Failed to load discounts.');
            } finally {
                setLoading(false);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/users`);
                setUsers(response.data.data); // Отримуємо список користувачів
            } catch (err) {
                console.error('Failed to fetch users:', err);
                alert('Failed to load users.');
            }
        };

        fetchDiscounts();
        fetchUsers();
    }, []);

    const handleEdit = (id) => {
        const discountToEdit = discounts.find((discount) => discount.id === id);
        setNewDiscount({
            name: discountToEdit.name,
            amount: discountToEdit.amount,
            startDate: discountToEdit.startDate,
            endDate: discountToEdit.endDate,
            userIds: discountToEdit.userIds || [],
        });
        setEditingDiscountId(id);
        setOpen(true);
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this discount?');
        if (confirmed) {
            try {
                await axios.delete(`${API_BASE_URL}/discounts/${id}`);
                setDiscounts(discounts.filter((discount) => discount.id !== id));
            } catch (err) {
                console.error('Failed to delete discount:', err);
                alert('Failed to delete discount.');
            }
        }
    };

    const handleOpen = () => {
        setNewDiscount({ name: '', amount: '', startDate: '', endDate: '', userIds: [] });
        setEditingDiscountId(null);
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDiscount((prev) => ({ ...prev, [name]: value }));
    };

    const handleUserChange = (e) => {
        setNewDiscount((prev) => ({ ...prev, userIds: e.target.value }));
    };

    const handleSaveDiscount = async () => {
        if (editingDiscountId) {
            try {
                const response = await axios.put(`${API_BASE_URL}/discounts/${editingDiscountId}`, newDiscount);
                setDiscounts((prev) =>
                    prev.map((discount) => (discount.id === editingDiscountId ? response.data : discount))
                );
                handleClose();
            } catch (err) {
                console.error('Failed to update discount:', err);
                alert('Failed to update discount.');
            }
        } else {
            try {
                const response = await axios.post(`${API_BASE_URL}/discounts`, newDiscount);
                setDiscounts((prev) => [...prev, response.data]);
                handleClose();
            } catch (err) {
                console.error('Failed to add discount:', err);
                alert('Failed to add discount.');
            }
        }
    };

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Container>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4} sx={{ mt: 4 }}>
                <Typography variant="h4">Discounts</Typography>
                <Button variant="contained" color="primary" onClick={handleOpen}>
                    Add New Discount
                </Button>
            </Stack>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Amount</strong></TableCell>
                            <TableCell><strong>Start Date</strong></TableCell>
                            <TableCell><strong>End Date</strong></TableCell>
                            <TableCell><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {discounts.map((discount) => (
                            <TableRow key={discount.id}>
                                <TableCell>{discount.name}</TableCell>
                                <TableCell>{discount.amount}%</TableCell>
                                <TableCell>{new Date(discount.startDate).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(discount.endDate).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        size="small"
                                        onClick={() => handleEdit(discount.id)}
                                        sx={{ marginRight: 1 }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        onClick={() => handleDelete(discount.id)}
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
                        {editingDiscountId ? 'Edit Discount' : 'Add New Discount'}
                    </Typography>
                    <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={newDiscount.name}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Amount (%)"
                        name="amount"
                        type="number"
                        value={newDiscount.amount}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Start Date and Time"
                        name="startDate"
                        type="datetime-local"
                        value={newDiscount.startDate}
                        onChange={handleInputChange}
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        fullWidth
                        label="End Date and Time"
                        name="endDate"
                        type="datetime-local"
                        value={newDiscount.endDate}
                        onChange={handleInputChange}
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="user-select-label">Users</InputLabel>
                        <Select
                            labelId="user-select-label"
                            multiple
                            value={newDiscount.userIds}
                            onChange={handleUserChange}
                            renderValue={(selected) =>
                                selected
                                    .map((id) => {
                                        const user = users.find((user) => user.id === id);
                                        return user ? user.email : id;
                                    })
                                    .join(', ')
                            }
                        >
                            {users.map((user) => (
                                <MenuItem key={user.id} value={user.id}>
                                    {user.email}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
                        <Button variant="outlined" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleSaveDiscount}>
                            {editingDiscountId ? 'Save' : 'Add'}
                        </Button>
                    </Stack>
                </Box>
            </Modal>
        </Container>
    );
};

export default DiscountsPage;