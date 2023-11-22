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
  Divider,
} from '@mui/material/';
import AccountCircle from '@mui/icons-material/AccountCircle';
import UserIcon from './assets/user.png';
import axios from 'axios';
import './components.css';

function ResponsiveAppBar() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [isFirstLogin, setIsFirstLogin] = React.useState(false);
  const [profile, setProfile] = React.useState(null);

  React.useEffect(() => {
    const firstLogin = localStorage.getItem('firstLogin');
    if (!firstLogin) {
      setIsFirstLogin(true);
      localStorage.setItem('firstLogin', 'false');
    }
    const userId = sessionStorage.getItem('user');
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/profile/${userId}`);
        if (response.data.length > 0) {
          const lastLoginSession = response.data[response.data.length - 1];
          setProfile({
            name: lastLoginSession.name,
            email: lastLoginSession.email,
            lastLogin: lastLoginSession.login_time,
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      }
    };
    fetchProfile();
  }, []);

  React.useEffect(() => {
    if (isFirstLogin) {
      // It is the first login so open the menu and then immediately set isFirstLogin to false
      setAnchorElUser(document.querySelector('button[aria-label=Profile]'));
      setIsFirstLogin(false);
    }
  }, [isFirstLogin]);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
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
    localStorage.removeItem('firstLogin');
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

            <Button
              component={Link} to="/courses"
              variant='outlined'
              sx={{ my: 2, color: 'white', display: 'block', borderWidth: 2, borderColor: '#9dc8f3', marginRight: '10px' }}
            >
              Courses
            </Button>

          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Profile">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }} aria-label="Profile">
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
              {profile && (
                <div className="UserContainer">
                  <img src={UserIcon} className="UserIcon"/>
                  <div className="Name">Hello, {profile.name}</div>
                  <div className="Email">{profile.email}</div>
                  <h4>Last Login:</h4>
                  <div className="LoginDate">{new Date(profile.lastLogin).toLocaleString()}</div>
                  <Divider />
                </div>
              )}
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

