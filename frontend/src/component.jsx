import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  Tooltip,
  MenuItem,
} from '@mui/material/';
import AccountCircle from '@mui/icons-material/AccountCircle';

const settings = ['Profile', 'Logout'];

function ResponsiveAppBar() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    // Send an API request to the backend to logout
    var userId = sessionStorage.getItem('user');
    fetch(`http://localhost:5000/logout/${userId}`, {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
      });
    setAnchorElUser(null);
    sessionStorage.clear();
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex' }}>
            <Button
              component={Link} to="/upcoming"
              variant='outlined'
              sx={{ my: 2, color: 'white', display: 'block', borderWidth: 2, borderColor: '#9dc8f3', marginRight: '10px' }}
            >
              Upcoming
            </Button>

            <Button
              component={Link} to="/timetable"
              variant='outlined'
              sx={{ my: 2, color: 'white', display: 'block', borderWidth: 2, borderColor: '#9dc8f3', marginRight: '10px' }}
            >
              Timetable
            </Button>

          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Profile">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {/* later maybe let user change profile icon */}
                {/* <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" /> */}
                <AccountCircle />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem key='profile' onClick={handleCloseUserMenu} component={Link} to="/profile">
                <Typography textAlign="center">Profile</Typography>
              </MenuItem>
              <MenuItem key='logout' onClick={handleLogout} component={Link} to="/">
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;