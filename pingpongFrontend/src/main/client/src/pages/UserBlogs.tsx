import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Link as MuiLink,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { blogService } from '../services/api';
import type { Blog } from '../types';

const UserBlogs: React.FC = () => {
  const [username, setUsername] = useState('');
  const [search, setSearch] = useState('');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchedUser, setSearchedUser] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setBlogs([]);
    setSearchedUser('');
    try {
      // Assuming you have an endpoint to get blogs by username
      const response = await blogService.getBlogsByUser(username);
      setBlogs(response);
      setSearchedUser(username);
    } catch (err) {
      setError('User not found or no blogs for this user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>Search User Blogs</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
          />
          <Button variant="contained" color="primary" onClick={handleSearch} disabled={loading || !username.trim()}>
            Search
          </Button>
        </Box>
        {loading && <CircularProgress />}
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        {searchedUser && (
          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Blogs by {searchedUser}</Typography>
        )}
        {blogs.length === 0 && searchedUser && !loading && !error && (
          <Typography color="text.secondary">No blogs found for this user.</Typography>
        )}
        {blogs.map((blog) => (
          <Box key={blog.id} sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
            <MuiLink component={Link} to={`/blogs/${blog.id}`} variant="h6" underline="hover">
              {blog.title}
            </MuiLink>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {new Date(blog.createdAt).toLocaleDateString()}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {blog.content.substring(0, 150)}...
            </Typography>
          </Box>
        ))}
      </Paper>
    </Container>
  );
};

export default UserBlogs; 