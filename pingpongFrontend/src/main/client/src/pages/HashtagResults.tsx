import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper, Avatar, IconButton, Chip, Grid, CardMedia, CircularProgress, Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import axios from 'axios';
import type { Blog } from '../types';

const HashtagResults = () => {
  const { tag } = useParams<{ tag: string }>();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/blogs/search?hashtag=${encodeURIComponent(tag || '')}`);
        setBlogs(response.data as Blog[]);
      } catch (err) {
        setError('Failed to fetch blogs for this hashtag.');
      } finally {
        setLoading(false);
      }
    };
    if (tag) fetchBlogs();
  }, [tag]);

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress /></Box>;
  }

  if (error) {
    return <Container maxWidth="md" sx={{ mt: 4 }}><Typography color="error" align="center">{error}</Typography></Container>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Blogs with <Chip label={`#${tag}`} color="primary" size="small" />
      </Typography>
      <Box>
        <Grid spacing={3}>
          {blogs.length === 0 ? (
            <Grid>
              <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                No blogs found for this hashtag.
              </Typography>
            </Grid>
          ) : (
            blogs.map((blog) => (
              <Grid key={blog.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper
                  elevation={3}
                  sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                    transition: 'transform 0.15s, box-shadow 0.15s',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 },
                    display: 'flex',
                    flexDirection: 'row',
                    height: 200,
                    maxHeight: 200,
                    minHeight: 200,
                    p: 0,
                    mb: 3,
                    overflow: 'hidden'
                  }}
                >
                  <Box sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column', minHeight: 0, width: '60%' }}>
                    <Link to={`/blogs/${blog.id}`} style={{ textDecoration: 'none' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#222', mb: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '1.1rem' }}>
                        {blog.title}
                      </Typography>
                    </Link>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                      sx={{
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        minHeight: '3.6em',
                        maxHeight: '3.6em',
                        fontSize: '0.9rem'
                      }}
                    >
                      {blog.content}
                    </Typography>
                    {Array.isArray(blog.hashtags) && blog.hashtags.length > 0 && (
                      <Box sx={{ mb: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {blog.hashtags.map((t) => (
                          <Chip
                            key={t}
                            label={`#${t}`}
                            color={t === tag ? 'primary' : 'secondary'}
                            size="small"
                            onClick={() => navigate(`/search/hashtag/${t}`)}
                            sx={{ cursor: 'pointer' }}
                          />
                        ))}
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 'auto' }}>
                      <Link to={`/users/${blog.author.username}`} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                        <Avatar src={blog.author.profilePicture} alt={blog.author.username} sx={{ width: 24, height: 24, mr: 1 }} />
                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                          {blog.author.fullName || blog.author.username}
                        </Typography>
                      </Link>
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 1, fontSize: '0.75rem' }}>
                        {blog.updatedAt !== blog.createdAt
                          ? `Updated at: ${new Date(blog.updatedAt).toLocaleString()}`
                          : `Created at: ${new Date(blog.createdAt).toLocaleString()}`}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <IconButton size="small" color="default" sx={{ padding: '4px' }}>
                          <FavoriteBorderIcon sx={{ fontSize: '1rem' }} />
                        </IconButton>
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{blog.likeCount ?? 0}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <IconButton size="small" sx={{ padding: '4px' }}>
                          <CommentIcon color="primary" sx={{ fontSize: '1rem' }} />
                        </IconButton>
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{blog.commentCount ?? 0}</Typography>
                      </Box>
                    </Box>
                  </Box>
                  <CardMedia
                    component="img"
                    sx={{
                      width: '40%',
                      height: '100%',
                      objectFit: 'cover',
                      borderTopRightRadius: 12,
                      borderBottomRightRadius: 12
                    }}
                    image={blog.imageUrl || 'https://www.standardbio.com/Store/NoImageAvailable.jpeg'}
                    alt={blog.title}
                  />
                </Paper>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
      <Button variant="outlined" sx={{ mt: 3 }} onClick={() => navigate(-1)}>Back</Button>
    </Container>
  );
};

export default HashtagResults; 