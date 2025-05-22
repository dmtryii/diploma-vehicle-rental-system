import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem
} from '@mui/material';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';

const CarForm = ({ open, handleClose, refreshCars, car }) => {
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
    engine_id: 'f881d99d-b06f-4d33-995d-e82966bb78ad',
    status: ''
  });

  const [manufacturers, setManufacturers] = useState([]);
  const [colors, setColors] = useState([]);
  const [bodyTypes, setBodyTypes] = useState([]);
  const [drivetrainTypes, setDrivetrainTypes] = useState([]);
  const [technicalConditions, setTechnicalConditions] = useState([]);
  const [transmissionTypes, setTransmissionTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [manufacturersRes, statusesRes, colorsRes, bodyTypesRes, drivetrainRes, technicalRes, transmissionRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/manufacturers`),
          axios.get(`${API_BASE_URL}/vehicles/statuses`),
          axios.get(`${API_BASE_URL}/vehicles/colors`),
          axios.get(`${API_BASE_URL}/vehicles/body-types`),
          axios.get(`${API_BASE_URL}/vehicles/drivetrain-types`),
          axios.get(`${API_BASE_URL}/vehicles/technical-conditions`),
          axios.get(`${API_BASE_URL}/vehicles/transmission-types`)
        ]);

        setManufacturers(manufacturersRes.data.data);
        setStatuses(statusesRes.data.data);
        setColors(colorsRes.data.data);
        setBodyTypes(bodyTypesRes.data.data);
        setDrivetrainTypes(drivetrainRes.data.data);
        setTechnicalConditions(technicalRes.data.data);
        setTransmissionTypes(transmissionRes.data.data);

      } catch (err) {
        console.error('Failed to fetch dropdown data:', err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (car) {
      setFormData(car);
    }
  }, [car]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
  
      const createResponse = await axios.post(`${API_BASE_URL}/vehicles`, formData);
      const vehicleId = createResponse.data.data.id;
  
      if (file && vehicleId) {
        const formDataFile = new FormData();
        formDataFile.append("file", file);
        await axios.post(`${API_BASE_URL}/vehicles/${vehicleId}/media`, formDataFile, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
  
      handleClose();
      refreshCars();
    } catch (err) {
      console.error('Failed to save car or upload media:', err);
    }
  };

  const renderSelect = (label, name, options) => (
    <TextField
      select
      label={label}
      name={name}
      value={formData[name]}
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
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{car ? 'Edit Car' : 'Add New Car'}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Price" name="price" value={formData.price} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Years" name="years" value={formData.years} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="License Plate" name="licensePlate" value={formData.licensePlate} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="VIN Code" name="vinCode" value={formData.vinCode} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Mileage" name="mileage" value={formData.mileage} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Max Speed" name="maxSpeed" value={formData.maxSpeed} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Description" name="description" value={formData.description} onChange={handleChange} fullWidth margin="normal" multiline />
          {renderSelect("Manufacturer", "manufacturer_id", manufacturers.map(m => ({ title: m.name, value: m.id })))}
          {renderSelect("Status", "status", statuses.map(s => ({ title: s.title, value: s.value })))}
          {renderSelect("Color", "color", colors.map(c => ({ title: c.title, value: c.value })))}
          {renderSelect("Body Type", "bodyType", bodyTypes.map(b => ({ title: b.title, value: b.value })))}
          {renderSelect("Drivetrain Type", "drivetrainType", drivetrainTypes.map(d => ({ title: d.title, value: d.value })))}
          {renderSelect("Technical Condition", "technicalCondition", technicalConditions.map(t => ({ title: t.title, value: t.value })))}
          {renderSelect("Transmission Type", "transmissionType", transmissionTypes.map(t => ({ title: t.title, value: t.value })))}
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <DialogActions>
            <Button onClick={handleClose} color="secondary">Cancel</Button>
            <Button type="submit" variant="contained" color="primary">{car ? 'Save Changes' : 'Add Car'}</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CarForm;
