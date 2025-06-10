import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, CircularProgress, Box, Button } from '@mui/material';
import { blogService } from '../services/api';
import type { Blog } from '../types';
import CommentsSection from '../components/CommentsSection';

const BlogDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) {
        setError('Invalid blog ID');
        setLoading(false);
        return;
      }

      try {
        const data = await blogService.getBlog(Number(id));
        setBlog(data);
      } catch (err: any) {
        console.error('Error fetching blog:', err);
        setError(err.response?.data || 'Failed to load blog');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error" variant="h6" gutterBottom>
            {error}
          </Typography>
          <Button variant="contained" color="primary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!blog) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Blog not found
          </Typography>
          <Button variant="contained" color="primary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {blog.title}
        </Typography>
        {blog.imageUrl && (
          <Box sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
            <img
              src={blog.imageUrl}
              alt={blog.title}
              style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
            />
          </Box>
        )}
        <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap' }}>
          {blog.content}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="subtitle2" color="textSecondary">
            By {blog.author.fullName || blog.author.username} • {new Date(blog.createdAt).toLocaleString()}
          </Typography>
        </Box>
        <CommentsSection blogId={blog.id} />
      </Paper>
    </Container>
  );
};

export default BlogDetails; 