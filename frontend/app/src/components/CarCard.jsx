import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Carousel from 'react-material-ui-carousel';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CarCard = ({ car, onDelete, onEdit }) => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // Не переходити, якщо клік по кнопці
    if (e.target.closest('button')) return;
    navigate(`/car-info/${car.id}`);
  };

  const getImageSrc = (mediaFile) => {
    if (!mediaFile?.data) return '/placeholder.jpg';

    if (mediaFile.data.startsWith('data:image')) {
      return mediaFile.data;
    } else if (typeof mediaFile.data === 'string') {
      return `data:${mediaFile.contentType};base64,${mediaFile.data}`;
    } else if (mediaFile.data instanceof Blob) {
      return URL.createObjectURL(mediaFile.data);
    }
    return '/placeholder.jpg';
  };

  const mediaFiles = Array.isArray(car.vehicleMediaFile)
    ? car.vehicleMediaFile
    : [];

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        cursor: 'pointer',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'scale(1.04)',
          boxShadow: 6,
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      elevation={4}
    >
      <Box sx={{ position: 'relative' }}>
        <Carousel
          navButtonsAlwaysVisible
          indicators={mediaFiles.length > 1}
          height={200}
        >
          {mediaFiles.length > 0 ? (
            mediaFiles.map((file, index) => (
              <img
                key={index}
                src={getImageSrc(file)}
                alt={`car-${index}`}
                style={{
                  width: '100%',
                  height: 200,
                  objectFit: 'cover',
                  filter: car.status !== 'AVAILABLE' ? 'grayscale(100%)' : 'none',
                  transition: 'filter 0.3s ease',
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}
              />
            ))
          ) : (
            <img
              src="/placeholder.jpg"
              alt="placeholder"
              style={{
                width: '100%',
                height: 200,
                objectFit: 'cover',
                filter: car.status !== 'AVAILABLE' ? 'grayscale(100%)' : 'none',
                transition: 'filter 0.3s ease',
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              }}
            />
          )}
        </Carousel>
        <Chip
          label={car.status}
          color={car.status === 'AVAILABLE' ? 'success' : 'error'}
          size="small"
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            fontWeight: 'bold',
            fontSize: 14,
            zIndex: 2,
          }}
        />
        <Typography
          variant="h6"
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            bgcolor: 'rgba(255,255,255,0.85)',
            px: 1.5,
            borderRadius: 2,
            fontWeight: 'bold',
            color: 'primary.main',
            zIndex: 2,
          }}
        >
          ${car.price}
        </Typography>
      </Box>

      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 600 }}>
            {car.manufacturer?.name} {car.name}
          </Typography>
          {authState.user &&
            authState.user.roles?.some(role => role.name === 'ROLE_MANAGER') && (
              <Box>
                <IconButton onClick={(e) => { e.stopPropagation(); onEdit(car); }}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={(e) => { e.stopPropagation(); onDelete(car.id); }}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            Year: <b>{car.years}</b> | Body: <b>{car.bodyType}</b>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Color: <b>{car.color}</b> | Mileage: <b>{car.mileage} km</b>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Transmission: <b>{car.transmissionType}</b> | Max speed: <b>{car.maxSpeed} km/h</b>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            License Plate: <b>{car.licensePlate}</b>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CarCard;