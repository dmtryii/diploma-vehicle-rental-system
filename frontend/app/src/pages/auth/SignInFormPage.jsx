import React, { useState } from 'react';
import { TextField, Button, Container, Box, Typography } from '@mui/material';
import axios from 'axios';
import { API_BASE_URL } from '../../api/config';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SignInFormPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/authenticate`, formData);
        const data = response.data['data'];
        const token = data['token'];
        const userData = data['user'];

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
          SignIn
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
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth>
            Signin
          </Button>
          <Button 
            onClick={() => navigate('/signup')} 
            fullWidth>
            Don’t have an account? Sign Up
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default SignInFormPage;
