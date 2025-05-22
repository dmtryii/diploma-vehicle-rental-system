import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const AddNewCarCard = ({ action }) => (
  <Card 
    onClick={action} 
    sx={{
      cursor: 'pointer',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: 6,
      },
    }}
  >
    <CardMedia
      component="div"
      sx={{
        height: 140,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'primary.light',
      }}
    >
      <AddIcon sx={{ fontSize: 50, color: 'primary.main' }} />
    </CardMedia>
    <CardContent sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        Add New Car
      </Typography>
    </CardContent>
  </Card>
);

export default AddNewCarCard;