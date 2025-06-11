package com.pingpong.pingpongBackend.repository;

import com.pingpong.pingpongBackend.entity.Comment;
import com.pingpong.pingpongBackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByBlogId(Long blogId);
    List<Comment> findByAuthor(User user);
    long countByBlog(com.pingpong.pingpongBackend.entity.Blog blog);
} 