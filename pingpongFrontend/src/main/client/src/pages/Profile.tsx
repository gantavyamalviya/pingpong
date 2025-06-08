import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { blogService } from '../services/api';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Button,
  Box,
  Tab,
  Tabs,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Favorite as FavoriteIcon,
  Comment as CommentIcon,
} from '@mui/icons-material';

const Profile = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchUserBlogs = async () => {
      if (user?.username) {
        try {
          const data = await blogService.getBlogsByUser(user.username);
          setBlogs(data);
        } catch (err) {
          console.error('Error fetching user blogs:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUserBlogs();
  }, [user]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (!user) {
    return (
      <Container>
        <Typography>Please log in to view your profile.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Avatar
              src={user.profilePicture || 'https://source.unsplash.com/random/200x200?portrait'}
              sx={{ width: 150, height: 150, mx: 'auto', mb: 2 }}
            />
            <Typography variant="h4" gutterBottom>
              {user.fullName}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              @{user.username}
            </Typography>
            <Typography variant="body1" paragraph>
              {user.bio || 'No bio provided.'}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              sx={{ mb: 2 }}
            >
              Edit Profile
            </Button>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Blogs" />
                <Tab label="Likes" />
                <Tab label="Comments" />
              </Tabs>
            </Box>
            {tabValue === 0 && (
              <Grid container spacing={3}>
                {loading ? (
                  <Box display="flex" justifyContent="center" width="100%">
                    <CircularProgress />
                  </Box>
                ) : blogs.length > 0 ? (
                  blogs.map((blog) => (
                    <Grid item xs={12} key={blog.id}>
                      <Card>
                        <CardMedia
                          component="img"
                          height="200"
                          image={blog.imageUrl || 'https://source.unsplash.com/random/800x600?blog'}
                          alt={blog.title}
                        />
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {blog.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {blog.content}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton size="small">
                              <FavoriteIcon />
                            </IconButton>
                            <Typography variant="body2" sx={{ mr: 2 }}>
                              {blog.likes || 0}
                            </Typography>
                            <IconButton size="small">
                              <CommentIcon />
                            </IconButton>
                            <Typography variant="body2">
                              {blog.comments || 0}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Typography>No blogs found.</Typography>
                )}
              </Grid>
            )}
            {tabValue === 1 && (
              <Typography>Liked blogs will appear here</Typography>
            )}
            {tabValue === 2 && (
              <Typography>Comments will appear here</Typography>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile; 