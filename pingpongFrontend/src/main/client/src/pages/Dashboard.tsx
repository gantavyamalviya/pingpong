import React, { useState, useEffect } from 'react';
import {
  Container,
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
  Avatar,
  Paper,
  Typography,
  IconButton,
  Grid
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { blogService, likeService } from '../services/api';
import type { Blog, PaginatedResponse } from '../types';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CommentsSection from '../components/CommentsSection';

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
  const [likeStates, setLikeStates] = useState<Record<number, { liked: boolean; count: number }>>({});
  const [commentDialog, setCommentDialog] = useState<{ open: boolean; blogId: number | null }>({ open: false, blogId: null });

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response: PaginatedResponse<Blog> = await blogService.getBlogs(page - 1, 10);
        setBlogs(response.content);
        setTotalPages(response.totalPages);
        // Fetch like state for each blog
        const likeStatesObj: Record<number, { liked: boolean; count: number }> = {};
        await Promise.all(
          response.content.map(async (blog) => {
            try {
              const [liked, count] = await Promise.all([
                likeService.isBlogLikedByUser(blog.id),
                likeService.getLikeCount(blog.id),
              ]);
              likeStatesObj[blog.id] = { liked, count };
            } catch {
              likeStatesObj[blog.id] = { liked: false, count: 0 };
            }
          })
        );
        setLikeStates(likeStatesObj);
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
      setPage(1);
    } catch (err) {
      setCreateError('Failed to create blog.');
    } finally {
      setCreating(false);
    }
  };

  const handleLike = async (blogId: number) => {
    if (!user) return;
    const current = likeStates[blogId];
    try {
      if (current.liked) {
        await likeService.unlikeBlog(blogId);
        setLikeStates((prev) => ({
          ...prev,
          [blogId]: { liked: false, count: Math.max(0, prev[blogId].count - 1) },
        }));
      } else {
        await likeService.likeBlog(blogId);
        setLikeStates((prev) => ({
          ...prev,
          [blogId]: { liked: true, count: prev[blogId].count + 1 },
        }));
      }
    } catch (err) {
      // Optionally show error
    }
  };

  const handleOpenComments = (blogId: number) => {
    setCommentDialog({ open: true, blogId });
  };
  const handleCloseComments = () => {
    setCommentDialog({ open: false, blogId: null });
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
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Create New Blog
        </Button>
        <Button variant="outlined" color="secondary" onClick={logout} sx={{ ml: 2 }}>
          Logout
        </Button>
      </Box>
      <Box>
        {blogs.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            No blogs found.
          </Typography>
        ) : (
          blogs.map((blog) => (
            <Paper
              key={blog.id}
              elevation={0}
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 3,
                border: '1px solid #e0e0e0',
                transition: 'box-shadow 0.2s',
                '&:hover': {
                  boxShadow: 4,
                  borderColor: '#bdbdbd',
                },
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 3,
                alignItems: 'flex-start',
              }}
            >
              {blog.imageUrl && (
                <Box
                  sx={{
                    minWidth: 160,
                    maxWidth: 200,
                    height: 120,
                    flexShrink: 0,
                    borderRadius: 2,
                    overflow: 'hidden',
                    background: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              )}
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar
                    src={blog.author.profilePicture}
                    alt={blog.author.username}
                    sx={{ width: 32, height: 32, mr: 1 }}
                  />
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {blog.author.fullName || blog.author.username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    • {new Date(blog.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <MuiLink
                  component={Link}
                  to={`/blogs/${blog.id}`}
                  variant="h5"
                  underline="hover"
                  sx={{ fontWeight: 700, color: '#222', mb: 1, display: 'block' }}
                >
                  {blog.title}
                </MuiLink>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                  {blog.content.length > 200 ? blog.content.substring(0, 200) + '...' : blog.content}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                  <IconButton
                    size="small"
                    color={likeStates[blog.id]?.liked ? 'error' : 'default'}
                    onClick={() => handleLike(blog.id)}
                    disabled={!user}
                  >
                    {likeStates[blog.id]?.liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                  <Typography variant="body2" sx={{ mr: 2 }}>
                    {likeStates[blog.id]?.count ?? 0}
                  </Typography>
                  <IconButton size="small" onClick={() => handleOpenComments(blog.id)}>
                    <ChatBubbleOutlineIcon />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
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
      </Box>
      <Dialog open={commentDialog.open} onClose={handleCloseComments} maxWidth="sm" fullWidth>
        <DialogContent>
          {commentDialog.blogId && <CommentsSection blogId={commentDialog.blogId} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseComments}>Close</Button>
        </DialogActions>
      </Dialog>
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
  );
};

export default Dashboard; 