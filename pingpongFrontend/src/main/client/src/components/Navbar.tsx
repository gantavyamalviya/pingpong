import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';

const settings = [
  { title: 'Profile', path: '/profile' },
  { title: 'Dashboard', path: '/dashboard' },
  { title: 'Logout', action: 'logout' },
];

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleUserMenuClick = (setting: { title: string; path?: string; action?: string }) => {
    handleCloseUserMenu();
    if (setting.action === 'logout') {
      logout();
      navigate('/');
    } else if (setting.path) {
      navigate(setting.path);
    }
  };

  // Live user search
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (value.trim().length === 0) {
      setSearchResults([]);
      setSearchOpen(false);
      return;
    }
    setAnchorEl(e.currentTarget);
    try {
      const results = await userService.searchUsers(value);
      setSearchResults(results);
      setSearchOpen(true);
    } catch {
      setSearchResults([]);
      setSearchOpen(false);
    }
  };

  const handleSelectUser = (username: string) => {
    setSearch('');
    setSearchResults([]);
    setSearchOpen(false);
    navigate(`/users/${username}`);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setSearchOpen(false);
    }
  };

  const handleClickAway = () => {
    setSearchOpen(false);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo for larger screens */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            PINGPONG
          </Typography>

          {/* Logo for mobile screens */}
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            PINGPONG
          </Typography>

          {/* User Search Bar */}
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: 350, mx: 'auto' }}>
            <ClickAwayListener onClickAway={handleClickAway}>
              <Box sx={{ width: '100%', position: 'relative' }}>
                <Paper
                  component="form"
                  sx={{
                    p: '2px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    boxShadow: 0,
                    borderRadius: 3,
                    bgcolor: 'rgba(255,255,255,0.25)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.18)',
                  }}
                  onSubmit={e => e.preventDefault()}
                >
                  <SearchIcon sx={{ color: 'grey.600', mr: 1 }} />
                  <InputBase
                    placeholder="Search users…"
                    value={search}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchKeyDown}
                    sx={{ ml: 1, flex: 1, color: '#fff', '::placeholder': { color: '#fff', opacity: 0.8 } }}
                    inputProps={{ 'aria-label': 'search users', style: { color: '#fff' } }}
                  />
                </Paper>
                <Popper
                  open={searchOpen && searchResults.length > 0}
                  anchorEl={anchorEl}
                  placement="bottom-start"
                  style={{
                    zIndex: 1301,
                    width: anchorEl ? anchorEl.clientWidth : undefined,
                  }}
                >
                  <Paper
                    sx={{
                      mt: 1,
                      width: anchorEl ? anchorEl.clientWidth : '100%',
                      maxHeight: 300,
                      overflowY: 'auto',
                      borderRadius: 3,
                      bgcolor: 'rgba(255,255,255,0.85)',
                      boxShadow: 4,
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    {searchResults.map((u) => (
                      <MenuItem
                        key={u.username}
                        component={RouterLink}
                        to={`/users/${u.username}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                        onClick={() => handleSelectUser(u.username)}
                        sx={{
                          borderRadius: 2,
                          my: 0.5,
                          '&:hover': {
                            bgcolor: 'rgba(0, 123, 255, 0.08)',
                          },
                        }}
                      >
                        <Avatar src={u.profilePicture} sx={{ width: 28, height: 28, mr: 1 }} />
                        <Box>
                          <Typography variant="subtitle2">{u.fullName || u.username}</Typography>
                          <Typography variant="caption" color="text.secondary">@{u.username}</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Paper>
                </Popper>
              </Box>
            </ClickAwayListener>
          </Box>

          {/* User menu */}
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user.username || 'User'} src={user.profilePicture} />
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
                    <MenuItem key={setting.title} onClick={() => handleUserMenuClick(setting)}>
                      <Typography textAlign="center">{setting.title}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  component={RouterLink}
                  to="/login"
                  color="inherit"
                  variant="outlined"
                  sx={{ borderColor: 'white' }}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  color="inherit"
                  variant="contained"
                  sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
                >
                  Register
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 