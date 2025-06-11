package com.pingpong.pingpongBackend.service;

import com.pingpong.pingpongBackend.entity.Blog;
import com.pingpong.pingpongBackend.entity.Like;
import com.pingpong.pingpongBackend.entity.User;
import com.pingpong.pingpongBackend.exception.ResourceNotFoundException;
import com.pingpong.pingpongBackend.repository.BlogRepository;
import com.pingpong.pingpongBackend.repository.LikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LikeService {
    private final LikeRepository likeRepository;
    private final BlogRepository blogRepository;

    @Transactional
    public void likeBlog(Long blogId, User user) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found"));
        if (blog.getAuthor().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You cannot like your own post");
        }
        if (!likeRepository.existsByUserAndBlog(user, blog)) {
            Like like = new Like();
            like.setUser(user);
            like.setBlog(blog);
            likeRepository.save(like);
        }
    }

    @Transactional
    public void unlikeBlog(Long blogId, User user) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found"));
        likeRepository.deleteByUserAndBlog(user, blog);
    }

    public long getLikeCount(Long blogId) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found"));
        return likeRepository.countByBlog(blog);
    }

    public boolean isBlogLikedByUser(Long blogId, User user) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found"));
        return likeRepository.existsByUserAndBlog(user, blog);
    }
} 