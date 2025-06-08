import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Pagination,
  Link as MuiLink,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { blogService } from '../services/api';
import type { Blog, PaginatedResponse } from '../types';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [open, setOpen] = useState(false);
  const [newBlog, setNewBlog] = useState({ title: '', content: '', imageUrl: '' });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response: PaginatedResponse<Blog> = await blogService.getBlogs(page - 1, 10);
        setBlogs(response.content);
        setTotalPages(response.totalPages);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [page]);

  const handleOpen = () => {
    setOpen(true);
    setNewBlog({ title: '', content: '', imageUrl: '' });
    setCreateError(null);
  };
  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewBlog((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreate = async () => {
    setCreating(true);
    setCreateError(null);
    try {
      await blogService.createBlog(newBlog);
      setOpen(false);
      setNewBlog({ title: '', content: '', imageUrl: '' });
      // Refresh blogs
      setPage(1); // Optionally reset to first page
      // Optionally, you can refetch blogs here
    } catch (err) {
      setCreateError('Failed to create blog.');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <>
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="outlined" color="secondary" onClick={logout}>
          Logout
        </Button>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          {/* Welcome Section */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
              <Typography variant="h4" gutterBottom>
                Welcome, {user?.fullName || user?.username}!
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Here's what's happening in your blogging world.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ alignSelf: 'flex-start', mt: 2 }}
                onClick={handleOpen}
              >
                Create New Blog
              </Button>
            </Paper>
          </Grid>

          {/* Stats Section */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Your Blogs
              </Typography>
              <Typography variant="h3" color="primary">
                {blogs.length}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Total Views
              </Typography>
              <Typography variant="h3" color="primary">
                0
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Total Likes
              </Typography>
              <Typography variant="h3" color="primary">
                0
              </Typography>
            </Paper>
          </Grid>

          {/* Recent Blogs Section */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>
                All Blogs
              </Typography>
              {blogs.length === 0 ? (
                <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                  No blogs found.
                </Typography>
              ) : (
                blogs.map((blog) => (
                  <Box key={blog.id} sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                    <MuiLink component={Link} to={`/blogs/${blog.id}`} variant="h6" underline="hover">
                      {blog.title}
                    </MuiLink>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      By {blog.author.username} • {new Date(blog.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      {blog.content.substring(0, 150)}...
                    </Typography>
                  </Box>
                ))
              )}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Blog</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            name="title"
            fullWidth
            value={newBlog.title}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            label="Content"
            name="content"
            fullWidth
            multiline
            minRows={4}
            value={newBlog.content}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            label="Image URL"
            name="imageUrl"
            fullWidth
            value={newBlog.imageUrl}
            onChange={handleChange}
          />
          {createError && <Typography color="error" sx={{ mt: 1 }}>{createError}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={creating}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained" color="primary" disabled={creating || !newBlog.title || !newBlog.content}>
            {creating ? 'Posting...' : 'Post'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
    </>
  );
};

export default Dashboard; 