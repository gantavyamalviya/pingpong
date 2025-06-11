import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Avatar,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { userService, blogService } from '../services/api';
import type { PublicUserProfileDTO, BlogResponse } from '../types';

const PublicProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<PublicUserProfileDTO | null>(null);
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const [followers, setFollowers] = useState<number>(0);
  const [following, setFollowing] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openList, setOpenList] = useState<'followers' | 'following' | null>(null);
  const [listLoading, setListLoading] = useState(false);
  const [userList, setUserList] = useState<PublicUserProfileDTO[]>([]);
  const [listError, setListError] = useState<string | null>(null);
  const fallbackUrl = 'https://www.standardbio.com/Store/NoImageAvailable.jpeg';

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    Promise.all([
      userService.getFollowersCount(username),
      userService.getFollowingCount(username),
      userService.getPublicProfile(username),
      blogService.getBlogsByUser(username),
    ])
      .then(async ([followersCount, followingCount, userProfile, userBlogs]) => {
        setFollowers(followersCount);
        setFollowing(followingCount);
        setProfile(userProfile);
        setBlogs(userBlogs);
        if (currentUser && currentUser.username !== username) {
          const following = await userService.isFollowing(username);
          setIsFollowing(following);
        } else {
          setIsFollowing(false);
        }
      })
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false));
  }, [username, currentUser]);

  const handleFollow = async () => {
    if (!profile) return;
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await userService.unfollowUser(profile.username);
      } else {
        await userService.followUser(profile.username);
      }
      // Always refresh from backend
      const [followersCount, followingStatus] = await Promise.all([
        userService.getFollowersCount(profile.username),
        userService.isFollowing(profile.username),
      ]);
      setFollowers(followersCount);
      setIsFollowing(followingStatus);
    } catch (err) {
      console.error('Follow/unfollow error:', err);
      setError('Failed to update follow status');
    }
    setFollowLoading(false);
  };

  const handleOpenList = async (type: 'followers' | 'following') => {
    if (!username) return;
    setOpenList(type);
    setListLoading(true);
    setListError(null);
    try {
      const data = type === 'followers'
        ? await userService.getFollowers(username)
        : await userService.getFollowing(username);
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !profile) {
    return (
      <Container>
        <Typography color="error" align="center" sx={{ mt: 4 }}>{error || 'User not found'}</Typography>
      </Container>
    );
  }

  const isOwnProfile = currentUser && currentUser.username === profile.username;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar
            src={profile.profilePicture || 'https://source.unsplash.com/random/200x200?portrait'}
            sx={{ width: 100, height: 100 }}
          />
          <Box>
            <Typography variant="h4" gutterBottom>{profile.fullName || profile.username}</Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>@{profile.username}</Typography>
            <Typography variant="body1" paragraph>{profile.bio || 'No bio provided.'}</Typography>
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', mt: 1 }}>
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
              {!isOwnProfile && currentUser && (
                <Button
                  variant={isFollowing ? 'outlined' : 'contained'}
                  color="primary"
                  onClick={handleFollow}
                  disabled={followLoading}
                  sx={{ ml: 2 }}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>
      <Typography variant="h5" sx={{ mb: 2 }}>Blogs by {profile.fullName || profile.username}</Typography>
      <Grid container spacing={3}>
        {blogs.length === 0 ? (
          <Typography color="text.secondary" sx={{ ml: 2 }}>No blogs found.</Typography>
        ) : (
          blogs.map((blog) => (
            <Grid item xs={12} key={blog.id}>
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
                  <Typography variant="h6" gutterBottom>{blog.title}</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>{blog.content}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                    <Typography variant="body2">{blog.likeCount ?? 0} Likes</Typography>
                    <Typography variant="body2">{blog.commentCount ?? 0} Comments</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
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

export default PublicProfile; 