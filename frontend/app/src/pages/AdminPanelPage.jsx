import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DOCUMENTATION } from '../api/config';

const AdminPanelPage = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'User Management',
      description: 'View, edit, and manage all users and their roles in the system.',
      route: '/users',
      isExternal: false,
    },
    {
      title: 'API Documentation',
      description: 'Read the API documentation for integration and backend endpoints.',
      route: DOCUMENTATION,
      isExternal: true,
    },
  ];

  const handleActionClick = (action) => {
    if (action.isExternal) {
      window.open(action.route, "_blank", "noopener,noreferrer");
    } else {
      navigate(action.route);
    }
  };

  return (
    <Container>
      <Grid container spacing={4} mt={2}>
        {actions.map((action, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardActionArea onClick={() => handleActionClick(action)}>
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

export default AdminPanelPage;