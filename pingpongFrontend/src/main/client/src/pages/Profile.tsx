import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { blogService, userService } from '../services/api';
import type { BlogResponse, CommentResponse, UserProfileRequest } from '../types';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  DialogContentText,
} from '@mui/material';
import {
  Edit as EditIcon,
  Favorite as FavoriteIcon,
  Comment as CommentIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const [likedBlogs, setLikedBlogs] = useState<BlogResponse[]>([]);
  const [userComments, setUserComments] = useState<CommentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [likesLoading, setLikesLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<UserProfileRequest>({
    fullName: user?.fullName || '',
    bio: user?.bio || '',
    profilePicture: user?.profilePicture || '',
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [followers, setFollowers] = useState<number>(0);
  const [following, setFollowing] = useState<number>(0);
  const [openList, setOpenList] = useState<'followers' | 'following' | null>(null);
  const [listLoading, setListLoading] = useState(false);
  const [userList, setUserList] = useState<any[]>([]);
  const [listError, setListError] = useState<string | null>(null);
  const fallbackUrl = 'https://www.standardbio.com/Store/NoImageAvailable.jpeg';

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    blogService.getBlogsByUser(user.username)
      .then(setBlogs)
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (tabValue === 1 && user) {
      setLikesLoading(true);
      userService.getLikedBlogs()
        .then(setLikedBlogs)
        .catch(() => setLikedBlogs([]))
        .finally(() => setLikesLoading(false));
    }
    if (tabValue === 2 && user) {
      setCommentsLoading(true);
      userService.getUserComments()
        .then(setUserComments)
        .catch(() => setUserComments([]))
        .finally(() => setCommentsLoading(false));
    }
  }, [tabValue, user]);

  useEffect(() => {
    if (!user?.username) return;
    userService.getFollowersCount(user.username).then(setFollowers);
    userService.getFollowingCount(user.username).then(setFollowing);
  }, [user]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditOpen = () => {
    setEditForm({
      fullName: user?.fullName || '',
      bio: user?.bio || '',
      profilePicture: user?.profilePicture || '',
    });
    setEditError(null);
    setEditOpen(true);
  };
  const handleEditClose = () => setEditOpen(false);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm((prev: UserProfileRequest) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditSubmit = async () => {
    setEditLoading(true);
    setEditError(null);
    try {
      const updatedUser = await userService.updateProfile(editForm);
      setUser(updatedUser);
      setEditOpen(false);
    } catch (err: any) {
      setEditError('Failed to update profile.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleOpenList = async (type: 'followers' | 'following') => {
    if (!user?.username) return;
    setOpenList(type);
    setListLoading(true);
    setListError(null);
    try {
      const data = type === 'followers'
        ? await userService.getFollowers(user.username)
        : await userService.getFollowing(user.username);
      setUserList(data);
    } catch (err) {
      setListError('Failed to load list');
      setUserList([]);
    }
    setListLoading(false);
  };

  const handleCloseList = () => {
    setOpenList(null);
    setUserList([]);
    setListError(null);
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
        <Grid spacing={4}>
          <div style={{ textAlign: 'center' }}>
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
              onClick={handleEditOpen}
            >
              Edit Profile
            </Button>
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', justifyContent: 'center', mt: 1 }}>
              <Typography
                variant="body2"
                sx={{ cursor: 'pointer' }}
                onClick={() => handleOpenList('followers')}
                color="primary"
              >
                <b>{followers}</b> Followers
              </Typography>
              <Typography
                variant="body2"
                sx={{ cursor: 'pointer' }}
                onClick={() => handleOpenList('following')}
                color="primary"
              >
                <b>{following}</b> Following
              </Typography>
            </Box>
          </div>
          <div>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Blogs" />
                <Tab label="Likes" />
                <Tab label="Comments" />
              </Tabs>
            </Box>
            {tabValue === 0 && (
              <Grid spacing={3}>
                {loading ? (
                  <Box display="flex" justifyContent="center" width="100%">
                    <CircularProgress />
                  </Box>
                ) : blogs.length > 0 ? (
                  blogs.map((blog) => (
                    <div key={blog.id}>
                      <Card>
                        <CardMedia
                          component="img"
                          height="200"
                          image={blog.imageUrl || fallbackUrl}
                          alt={blog.title}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = fallbackUrl;
                          }}
                        />
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {blog.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {blog.content}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                            <FavoriteIcon fontSize="small" color="error" />
                            <Typography variant="body2">{blog.likeCount ?? 0}</Typography>
                            <CommentIcon fontSize="small" color="primary" />
                            <Typography variant="body2">{blog.commentCount ?? 0}</Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </div>
                  ))
                ) : (
                  <Typography>No blogs found.</Typography>
                )}
              </Grid>
            )}
            {tabValue === 1 && (
              <Grid spacing={3}>
                {likesLoading ? (
                  <Box display="flex" justifyContent="center" width="100%">
                    <CircularProgress />
                  </Box>
                ) : likedBlogs.length > 0 ? (
                  likedBlogs.map((blog) => (
                    <div key={blog.id}>
                      <Card>
                        <CardMedia
                          component="img"
                          height="200"
                          image={blog.imageUrl || fallbackUrl}
                          alt={blog.title}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = fallbackUrl;
                          }}
                        />
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {blog.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {blog.content}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                            <FavoriteIcon fontSize="small" color="error" />
                            <Typography variant="body2">{blog.likeCount ?? 0}</Typography>
                            <CommentIcon fontSize="small" color="primary" />
                            <Typography variant="body2">{blog.commentCount ?? 0}</Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </div>
                  ))
                ) : (
                  <Typography>No liked blogs found.</Typography>
                )}
              </Grid>
            )}
            {tabValue === 2 && (
              <Grid spacing={3}>
                {commentsLoading ? (
                  <Box display="flex" justifyContent="center" width="100%">
                    <CircularProgress />
                  </Box>
                ) : userComments.length > 0 ? (
                  userComments.map((comment) => (
                    <div key={comment.id}>
                      <Card>
                        <CardContent>
                          <Typography variant="body2" color="text.secondary">
                            {comment.content}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            On {comment.createdAt} by {comment.authorUsername}
                          </Typography>
                        </CardContent>
                      </Card>
                    </div>
                  ))
                ) : (
                  <Typography>No comments found.</Typography>
                )}
              </Grid>
            )}
          </div>
        </Grid>
      </Paper>
      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onClose={handleEditClose} maxWidth="xs" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Full Name"
            name="fullName"
            fullWidth
            value={editForm.fullName}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            label="Bio"
            name="bio"
            fullWidth
            multiline
            minRows={2}
            value={editForm.bio}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            label="Profile Picture URL"
            name="profilePicture"
            fullWidth
            value={editForm.profilePicture}
            onChange={handleEditChange}
          />
          {editError && <Typography color="error" sx={{ mt: 1 }}>{editError}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} disabled={editLoading}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary" disabled={editLoading}>
            {editLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={!!openList} onClose={handleCloseList} fullWidth maxWidth="xs">
        <DialogTitle>{openList === 'followers' ? 'Followers' : 'Following'}</DialogTitle>
        <DialogContent>
          {listLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
              <CircularProgress />
            </Box>
          ) : listError ? (
            <Typography color="error">{listError}</Typography>
          ) : userList.length === 0 ? (
            <Typography color="text.secondary">No users found.</Typography>
          ) : (
            <List>
              {userList.map((user) => (
                <ListItem
                  key={user.username}
                  component={Link}
                  to={`/users/${user.username}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  button
                >
                  <ListItemAvatar>
                    <Avatar src={user.profilePicture || undefined} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.fullName || user.username}
                    secondary={`@${user.username}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Profile; 