import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, List, ListItem, ListItemText, IconButton, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
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

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>Comments</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80px">
          <CircularProgress size={24} />
        </Box>
      ) : (
        <List>
          {comments.length === 0 && (
            <Typography color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
              No comments yet. Be the first to comment!
            </Typography>
          )}
          {comments.map((comment) => (
            <ListItem key={comment.id} alignItems="flex-start" secondaryAction={
              user && comment.author.username === user.username && (
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteComment(comment.id)} disabled={deleteLoading === comment.id}>
                  <DeleteIcon />
                </IconButton>
              )
            }>
              <ListItemText
                primary={comment.authorUsername || comment.author?.username || 'User'}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {new Date(comment.createdAt).toLocaleString()}
                    </Typography>
                    {': '}{comment.content}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
      {user && (
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <TextField
            label="Add a comment"
            variant="outlined"
            size="small"
            fullWidth
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={submitting}
          />
          <Button variant="contained" color="primary" onClick={handleAddComment} disabled={submitting || !newComment.trim()}>
            {submitting ? <CircularProgress size={18} /> : 'Post'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CommentsSection; 