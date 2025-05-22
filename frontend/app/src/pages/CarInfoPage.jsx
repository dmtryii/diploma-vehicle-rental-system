import React, { useState, useEffect } from 'react';
import {
    Container, Box, Typography, Grid, Paper, Checkbox, FormControlLabel, Button, Collapse, Divider, Chip, CircularProgress, TextField, Radio, RadioGroup, FormControl, FormLabel, FormControl as MuiFormControl, FormHelperText
} from '@mui/material';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import Carousel from 'react-material-ui-carousel';

const CarInfoPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { authState } = useAuth();

    const [vehicle, setVehicle] = useState(null);
    const [previewImages, setPreviewImages] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [showServices, setShowServices] = useState(false);
    const [loading, setLoading] = useState(true);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);

    const [discounts, setDiscounts] = useState([]);
    const [selectedDiscount, setSelectedDiscount] = useState('');

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/vehicles/${id}`);
                const vehicle = res.data.data;
                setVehicle(vehicle);

                const base64Images = vehicle.vehicleMediaFile?.map(file => {
                    const base64Data = file.data;
                    const contentType = file.contentType || "image/jpeg";
                    const url = `data:${contentType};base64,${base64Data}`;
                    return { url, id: file.id };
                }) || [];
                setPreviewImages(base64Images);
            } catch (err) {
                console.error('Failed to fetch vehicle data:', err);
            }
        };

        const fetchServices = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/additional-services`);
                setServices(res.data.data || []);
            } catch (err) {
                console.error('Failed to fetch services:', err);
            }
        };

        const fetchDiscounts = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/discounts/personal`, {
                    headers: {
                        Authorization: `Bearer ${authState.token}`
                    }
                });
                setDiscounts(res.data.data || []);
            } catch (err) {
                setDiscounts([]);
            }
        };

        Promise.all([fetchVehicle(), fetchServices(), fetchDiscounts()]).finally(() => setLoading(false));
    }, [id, authState.token]);

    useEffect(() => {
        if (!vehicle || !startDate || !endDate) {
            setTotalPrice(0);
            return;
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);

        const carTotal = vehicle.price * days;
        const servicesTotal = services
            .filter(s => selectedServices.includes(s.id))
            .reduce((sum, s) => sum + Number(s.price), 0);

        let discountAmount = 0;
        if (selectedDiscount) {
            const discountObj = discounts.find(d => d.id === selectedDiscount);
            if (discountObj) {
                discountAmount = ((carTotal + servicesTotal) * discountObj.amount) / 100;
            }
        }

        setTotalPrice(carTotal + servicesTotal - discountAmount);
    }, [vehicle, startDate, endDate, selectedServices, services, selectedDiscount, discounts]);

    const handleServiceChange = (serviceId) => {
        setSelectedServices((prev) =>
            prev.includes(serviceId)
                ? prev.filter((id) => id !== serviceId)
                : [...prev, serviceId]
        );
    };

    const handleRentClick = () => {
        setShowServices((prev) => !prev);
    };

    const handleContinue = async () => {
        const startDateTime = startDate ? `${startDate}T00:00:00` : '';
        const endDateTime = endDate ? `${endDate}T23:59:59` : '';
        try {
            await axios.post(
                `${API_BASE_URL}/rentals`,
                {
                    startDate: startDateTime,
                    endDate: endDateTime,
                    vehicleId: vehicle.id,
                    additionalServicesIds: selectedServices,
                    discountId: selectedDiscount || null
                },
                {
                    headers: {
                        Authorization: `Bearer ${authState.token}`
                    }
                }
            );
            navigate('/account');
        } catch (error) {
            alert('Failed to create rental');
        }
    };

    const formatDateOnly = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
    }

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

    if (!vehicle) return <Typography>Loading...</Typography>;

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Carousel navButtonsAlwaysVisible indicators={previewImages.length > 1} height={300}>
                    {previewImages.length > 0 ? (
                        previewImages.map((img, idx) => (
                            <img
                                key={idx}
                                src={img.url}
                                alt={`car-${idx}`}
                                style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 8 }}
                            />
                        ))
                    ) : (
                        <img
                            src="/placeholder.jpg"
                            alt="No images"
                            style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 8 }}
                        />
                    )}
                </Carousel>

                <Box mt={3} mb={2} display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            {vehicle.manufacturer?.name} {vehicle.name}
                        </Typography>
                        <Chip
                            label={vehicle.status === 'AVAILABLE' ? 'Available' : vehicle.status}
                            color={vehicle.status === 'AVAILABLE' ? 'success' : 'default'}
                            sx={{ fontWeight: 'bold', fontSize: 16 }}
                        />
                    </Box>
                    <Box>
                        <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                            ${vehicle.price}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            per day
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                    {vehicle.description}
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ pl: 1 }}>
                            <Typography><strong>Body type:</strong> {vehicle.bodyType}</Typography>
                            <Typography><strong>Color:</strong> {vehicle.color}</Typography>
                            <Typography><strong>Year:</strong> {vehicle.years}</Typography>
                            <Typography><strong>Mileage:</strong> {vehicle.mileage} km</Typography>
                            <Typography><strong>License plate:</strong> {vehicle.licensePlate}</Typography>
                            <Typography><strong>VIN code:</strong> {vehicle.vinCode}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ pl: 1 }}>
                            <Typography><strong>Drivetrain:</strong> {vehicle.drivetrainType}</Typography>
                            <Typography><strong>Transmission:</strong> {vehicle.transmissionType}</Typography>
                            <Typography><strong>Condition:</strong> {vehicle.technicalCondition}</Typography>
                            <Typography><strong>Max speed:</strong> {vehicle.maxSpeed} km/h</Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Box mt={4} textAlign="center">
                    <Button
                        variant="contained"
                        color={vehicle.status === 'AVAILABLE' ? 'primary' : 'secondary'}
                        size="large"
                        disabled={vehicle.status !== 'AVAILABLE'}
                        onClick={handleRentClick}
                    >
                        {vehicle.status === 'AVAILABLE' ? (showServices ? 'Hide' : 'Rent') : 'Unavailable'}
                    </Button>
                </Box>

                <Collapse in={showServices}>
                    <Box mt={3} mb={2}>
                        <Typography variant="h6" gutterBottom>Select additional services</Typography>
                        {services.length === 0 && (
                            <Typography color="text.secondary">No additional services available</Typography>
                        )}
                        {services.map((service) => (
                            <FormControlLabel
                                key={service.id}
                                control={
                                    <Checkbox
                                        checked={selectedServices.includes(service.id)}
                                        onChange={() => handleServiceChange(service.id)}
                                    />
                                }
                                label={`${service.name} (+$${service.price})`}
                            />
                        ))}

                        <Box mt={3} display="flex" gap={2} flexWrap="wrap">
                            <TextField
                                label="Start date"
                                type="date"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                sx={{ minWidth: 180 }}
                            />
                            <TextField
                                label="End date"
                                type="date"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                sx={{ minWidth: 180 }}
                            />
                        </Box>

                        {(startDate && endDate && discounts.length > 0) && (
                            <MuiFormControl component="fieldset" sx={{ mt: 3 }}>
                                <FormLabel component="legend">Select discount</FormLabel>
                                <RadioGroup
                                    value={selectedDiscount}
                                    onChange={e => setSelectedDiscount(e.target.value)}
                                >
                                    <FormControlLabel value="" control={<Radio />} label="No discount" />
                                    {discounts.map((discount) => (
                                        <FormControlLabel
                                            key={discount.id}
                                            value={discount.id}
                                            control={<Radio />}
                                            label={`${discount.name} (${discount.amount}%) ${formatDateOnly(discount.startDate)} - ${formatDateOnly(discount.endDate)}`}
                                        />
                                    ))}
                                </RadioGroup>
                                <FormHelperText>
                                    Personal discounts available for this period
                                </FormHelperText>
                            </MuiFormControl>
                        )}

                        <Box mt={3}>
                            <Typography variant="h6" color="primary">
                                Total: ${totalPrice}
                            </Typography>
                        </Box>

                        <Box mt={2}>
                            <Button
                                variant="contained"
                                onClick={handleContinue}
                                disabled={!startDate || !endDate}
                            >
                                Rent
                            </Button>
                        </Box>
                    </Box>
                </Collapse>
            </Paper>
        </Container>
    );
};

export default CarInfoPage;