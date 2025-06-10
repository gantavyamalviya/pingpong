import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Alert,
  Avatar,
  Divider,
  Paper,
  InputAdornment,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { commentService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Comment } from '../types';

interface CommentsSectionProps {
  blogId: number;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ blogId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const data = await commentService.getComments(blogId);
      setComments(data);
    } catch (err) {
      setError('Failed to load comments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, [blogId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const comment = await commentService.addComment(blogId, newComment.trim());
      setComments((prev) => [...prev, comment]);
      setNewComment('');
    } catch (err) {
      setError('Failed to add comment.');
      console.error('Failed to add comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    setDeleteLoading(commentId);
    try {
      await commentService.deleteComment(blogId, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      setError('Failed to delete comment.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1a1a1a' }}>
        Comments
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      {/* Comment Input */}
      {user && (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            mb: 3, 
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            backgroundColor: '#fafafa'
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Avatar
              src={user.profilePicture}
              alt={user.username}
              sx={{ width: 40, height: 40 }}
            />
            <Box sx={{ flex: 1 }}>
              <TextField
                placeholder="Write a comment..."
                variant="outlined"
                fullWidth
                multiline
                maxRows={4}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={submitting}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    '&:hover': {
                      '& > fieldset': { borderColor: '#1976d2' },
                    },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        color="primary"
                        onClick={handleAddComment}
                        disabled={submitting || !newComment.trim()}
                        sx={{ ml: 1 }}
                      >
                        {submitting ? <CircularProgress size={24} /> : <SendIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
        </Paper>
      )}

      {/* Comments List */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80px">
          <CircularProgress size={24} />
        </Box>
      ) : (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {comments.length === 0 && (
            <Typography color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
              No comments yet. Be the first to comment!
            </Typography>
          )}
          {comments.map((comment, index) => {
            const canDelete = user && user.username && comment.authorUsername && 
              comment.authorUsername.toLowerCase() === user.username.toLowerCase();
            
            return (
              <React.Fragment key={comment.id}>
                {index > 0 && <Divider variant="inset" component="li" />}
                <ListItem
                  alignItems="flex-start"
                  sx={{ px: 0 }}
                  secondaryAction={
                    canDelete && (
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteComment(comment.id)}
                        disabled={deleteLoading === comment.id}
                        size="small"
                        sx={{ color: 'error.main' }}
                      >
                        {deleteLoading === comment.id ? (
                          <CircularProgress size={20} />
                        ) : (
                          <DeleteIcon />
                        )}
                      </IconButton>
                    )
                  }
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography
                          component="span"
                          variant="subtitle2"
                          sx={{ fontWeight: 600, color: '#1a1a1a' }}
                        >
                          {comment.authorUsername || 'User'}
                        </Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                        >
                          {new Date(comment.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                        sx={{ display: 'block', mt: 0.5 }}
                      >
                        {comment.content}
                      </Typography>
                    }
                  />
                </ListItem>
              </React.Fragment>
            );
          })}
        </List>
      )}
    </Box>
  );
};

export default CommentsSection; 