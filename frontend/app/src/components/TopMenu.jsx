import { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton, Avatar, Menu, MenuItem, Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TopMenu = () => {
  const navigate = useNavigate();
  const { authState, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleAccountMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const userInitial = authState.user?.username?.[0]?.toUpperCase() || 'G';

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'primary.main', boxShadow: 3 }}>
      <Toolbar>
        <Typography
          variant="h5"
          sx={{
            flexGrow: 1,
            fontWeight: 'bold',
            letterSpacing: 1,
            userSelect: 'none',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')}
        >
          Movee Rental
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button color="inherit" onClick={() => navigate('/')}>
            Vehicles
          </Button>
          {authState.user && authState.user.roles.some(role => role.name === 'ROLE_MANAGER') && (
            <Button color="inherit" onClick={() => navigate('/manager')}>
              Manager Panel
            </Button>
          )}
          {/* Account menu */}
          <Tooltip title={authState.user ? authState.user.username : 'Guest'}>
            <IconButton color="inherit" onClick={handleAccountMenu} sx={{ ml: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontWeight: 'bold' }}>
                {userInitial}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={() => { handleClose(); navigate('/account'); }}>
              Account
            </MenuItem>
            {!authState.user ? (
              <MenuItem onClick={() => { handleClose(); navigate('/signin'); }}>
                Sign In
              </MenuItem>
            ) : (
              <MenuItem onClick={() => { handleClose(); logout(); navigate('/signin'); }}>
                Log Out
              </MenuItem>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopMenu;