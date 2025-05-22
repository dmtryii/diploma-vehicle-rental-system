import React, { useState } from 'react';
import {
  TextField, Button, Select, MenuItem, InputLabel, FormControl,
  FormHelperText, Container, Box, Typography
} from '@mui/material';
import axios from 'axios';
import { API_BASE_URL } from '../../api/config';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SignupFormPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    gender: '',
    birthday: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.birthday) newErrors.birthday = 'Birthday is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/singup`, formData);
        const token = response.data['token'];

        const userResponse = await axios.get(`${API_BASE_URL}users/identity`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = userResponse.data.current_user;

        if (token) {
          login(token, userData);
          navigate('/');
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" component="h1" gutterBottom>
          SignUp
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.username}
            helperText={errors.username}
          />
          <TextField
            label="First Name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.first_name}
            helperText={errors.first_name}
          />
          <TextField
            label="Last Name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.last_name}
            helperText={errors.last_name}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password}
          />
          <FormControl fullWidth margin="normal" error={!!errors.gender}>
            <InputLabel>Gender</InputLabel>
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <MenuItem value="MALE">Male</MenuItem>
              <MenuItem value="FEMALE">Female</MenuItem>
              <MenuItem value="OTHER">Other</MenuItem>
            </Select>
            <FormHelperText>{errors.gender}</FormHelperText>
          </FormControl>
          <TextField
            label="Birthday"
            name="birthday"
            type="date"
            value={formData.birthday}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            error={!!errors.birthday}
            helperText={errors.birthday}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Signup
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default SignupFormPage;
