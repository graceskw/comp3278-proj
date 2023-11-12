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
}from '@mui/material/';
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
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;