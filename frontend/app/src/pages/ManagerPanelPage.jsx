import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ManagerPanel = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Add New Vehicle',
      description: 'Quickly register a new vehicle in the system for rental or service tracking.',
      route: '/add-car',
    },
    {
      title: 'Additional services',
      description: 'Manage extra offerings such as GPS, child seats, and insurance packages.',
      route: '/additional-services',
    },
    {
      title: 'Discounts',
      description: 'Create and manage promotional discounts and seasonal offers for customers.',
      route: '/discounts',
    },
    {
      title: 'Rentals',
      description: 'Browse, filter, and manage all ongoing and past car rental bookings.',
      route: '/rentals',
    },
    {
      title: 'Analytics',
      description: 'View rental statistics, revenue, and car popularity analytics.',
      route: '/analytics',
    },
  ];

  return (
    <Container>
      <Grid container spacing={4} mt={2}>
        {actions.map((action, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardActionArea onClick={() => navigate(action.route)}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {action.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {action.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ManagerPanel;