import React, { useState, useEffect } from 'react';
import {
    Container, Box, Typography, TextField, MenuItem,
    Button, Paper, Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';
import { useNavigate, useParams } from 'react-router-dom';

const EditCarPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        color: '',
        bodyType: '',
        drivetrainType: '',
        technicalCondition: '',
        transmissionType: '',
        years: '',
        licensePlate: '',
        vinCode: '',
        mileage: '',
        maxSpeed: '',
        description: '',
        manufacturerId: '',
        engine_id: '',
        engine: {
            name: '',
            fuelType: '',
            capacity: '',
            power: '',
        },
        status: ''
    });

    const [manufacturers, setManufacturers] = useState([]);
    const [colors, setColors] = useState([]);
    const [bodyTypes, setBodyTypes] = useState([]);
    const [drivetrainTypes, setDrivetrainTypes] = useState([]);
    const [technicalConditions, setTechnicalConditions] = useState([]);
    const [transmissionTypes, setTransmissionTypes] = useState([]);
    const [fuelTypes, setFuelTypes] = useState([]);
    const [engines, setEngines] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [files, setFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    useEffect(() => {
        const fetchDropdowns = async () => {
            try {
                const [
                    manufacturersRes, statusesRes, colorsRes, bodyTypesRes,
                    drivetrainRes, technicalRes, transmissionRes, enginesRes, fuelTypeRes
                ] = await Promise.all([
                    axios.get(`${API_BASE_URL}/manufacturers`),
                    axios.get(`${API_BASE_URL}/vehicles/statuses`),
                    axios.get(`${API_BASE_URL}/vehicles/colors`),
                    axios.get(`${API_BASE_URL}/vehicles/body-types`),
                    axios.get(`${API_BASE_URL}/vehicles/drivetrain-types`),
                    axios.get(`${API_BASE_URL}/vehicles/technical-conditions`),
                    axios.get(`${API_BASE_URL}/vehicles/transmission-types`),
                    axios.get(`${API_BASE_URL}/engines`),
                    axios.get(`${API_BASE_URL}/engines/fuel-types`)
                ]);

                setManufacturers(manufacturersRes.data.data);
                setStatuses(statusesRes.data.data);
                setColors(colorsRes.data.data);
                setBodyTypes(bodyTypesRes.data.data);
                setDrivetrainTypes(drivetrainRes.data.data);
                setTechnicalConditions(technicalRes.data.data);
                setTransmissionTypes(transmissionRes.data.data);
                setEngines(enginesRes.data.data);
                setFuelTypes(fuelTypeRes.data.data);
            } catch (err) {
                console.error('Failed to fetch dropdown data:', err);
            }
        };

        const fetchVehicle = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/vehicles/${id}`);
                const vehicle = res.data.data;
                setFormData({
                    ...vehicle,
                    engine: vehicle.engine || {
                        name: '',
                        fuelType: '',
                        capacity: '',
                        power: '',
                    }
                });
                const base64Images = vehicle.vehicleMediaFile.map(file => {
                    const base64Data = file.data;
                    const contentType = file.contentType || "image/jpeg";
                    const url = `data:${contentType};base64,${base64Data}`;
                    return { url, id: file.id, isNew: false }; // isNew = false => фото з БД
                });
                setPreviewImages(base64Images);
            } catch (err) {
                console.error('Failed to fetch vehicle data:', err);
            }
        };

        fetchDropdowns();
        fetchVehicle();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('engine.')) {
            const key = name.split('.')[1];
            setFormData((prev) => ({
                ...prev,
                engine: { ...prev.engine, [key]: value },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const previews = selectedFiles.map(file => ({
            url: URL.createObjectURL(file),
            file,
            isNew: true
        }));
        setFiles(prev => [...prev, ...selectedFiles]); // Масив файлів
        setPreviewImages(prev => [...prev, ...previews]);
    };

    const handleRemoveImage = async (image) => {
        if (!image.isNew) {
            try {
                await axios.delete(`${API_BASE_URL}/vehicles/${image.id}/media`);
            } catch (error) {
                console.error("Помилка при видаленні фото:", error);
            }
        } else {
            setFiles(prev => prev.filter(f => URL.createObjectURL(f) !== image.url));
        }

        setPreviewImages(prev => prev.filter(img => img.url !== image.url));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData };
            if (formData.engine_id) payload.engine = null;

            await axios.put(`${API_BASE_URL}/vehicles/${id}`, payload);

            if (files.length > 0) {
                for (const f of files) {
                    const formDataFile = new FormData();
                    formDataFile.append('file', f);
                    await axios.post(`${API_BASE_URL}/vehicles/${id}/media`, formDataFile, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                }
            }

            navigate('/cars');
        } catch (err) {
            console.error('Failed to update car:', err);
        }
    };

    const renderSelect = (label, name, options) => (
        <TextField
            select
            label={label}
            name={name}
            value={formData[name] || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
        >
            {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.title}
                </MenuItem>
            ))}
        </TextField>
    );

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 3 }}>
                <form onSubmit={handleSubmit}>
                    <Typography variant="h4" gutterBottom fontWeight={600}>
                        Edit Car
                    </Typography>

                    <Box my={3}>
                        <Typography variant="h6" gutterBottom>Media</Typography>
                        {previewImages.length > 0 && (
                            <Grid container spacing={2} mt={2}>
                                {previewImages.map((img, index) => (
                                    <Box key={index} mt={2} position="relative">
                                        <IconButton
                                            onClick={() => handleRemoveImage(img)}
                                            size="small"
                                            sx={{ position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff' }}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                        <img
                                            src={img.url}
                                            alt={`Preview ${index}`}
                                            style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }}
                                        />
                                    </Box>
                                ))}
                            </Grid>
                        )}
                        <Box mt={2}>
                            <Button variant="outlined" component="label">
                                Upload Images
                                <input type="file" hidden multiple accept="image/*" onChange={handleFileChange} />
                            </Button>
                        </Box>
                    </Box>

                    <Box my={3}>
                        <Typography variant="h6" gutterBottom>Basic Information</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField label="Price" name="price" value={formData.price} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {renderSelect("Manufacturer", "manufacturerId", manufacturers.map(m => ({ title: m.name, value: m.id })))}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {renderSelect("Status", "status", statuses.map(s => ({ title: s.title, value: s.value })))}
                            </Grid>
                        </Grid>
                    </Box>

                    <Box my={3}>
                        <Typography variant="h6" gutterBottom>Specifications</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                {renderSelect("Color", "color", colors.map(c => ({ title: c.title, value: c.value })))}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {renderSelect("Body Type", "bodyType", bodyTypes.map(b => ({ title: b.title, value: b.value })))}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {renderSelect("Drivetrain Type", "drivetrainType", drivetrainTypes.map(d => ({ title: d.title, value: d.value })))}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {renderSelect("Transmission Type", "transmissionType", transmissionTypes.map(t => ({ title: t.title, value: t.value })))}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {renderSelect("Technical Condition", "technicalCondition", technicalConditions.map(t => ({ title: t.title, value: t.value })))}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField label="Mileage" name="mileage" value={formData.mileage} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField label="Max Speed" name="maxSpeed" value={formData.maxSpeed} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField label="Years" name="years" value={formData.years} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField label="License Plate" name="licensePlate" value={formData.licensePlate} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField label="VIN Code" name="vinCode" value={formData.vinCode} onChange={handleChange} fullWidth />
                            </Grid>
                        </Grid>
                    </Box>

                    <Box my={3}>
                        <Typography variant="h6" gutterBottom>Engine</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    label="Select Existing Engine"
                                    name="engine_id"
                                    value={formData.engine_id}
                                    onChange={handleChange}
                                    fullWidth
                                >
                                    {engines.map((e) => (
                                        <MenuItem key={e.id} value={e.id}>
                                            {`${e.name} - ${e.capacity}L (${e.fuelType}/${e.power}ph)`}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField label="Engine Name" name="engine.name" value={formData.engine.name} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    label="Fuel Type"
                                    name="engine.fuelType"
                                    value={formData.engine.fuelType}
                                    onChange={handleChange}
                                    fullWidth
                                >
                                    {fuelTypes.map((t) => (
                                        <MenuItem key={t.value} value={t.value}>
                                            {t.title}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField label="Capacity (L)" name="engine.capacity" value={formData.engine.capacity} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField label="Power (HP)" name="engine.power" value={formData.engine.power} onChange={handleChange} fullWidth />
                            </Grid>
                        </Grid>
                    </Box>

                    <Box my={3}>
                        <Typography variant="h6" gutterBottom>Description</Typography>
                        <TextField
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={4}
                            margin="normal"
                        />
                    </Box>

                    <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
                        <Button variant="outlined" onClick={() => navigate('/cars')}>Cancel</Button>
                        <Button type="submit" variant="contained" color="primary">Update Car</Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default EditCarPage;
