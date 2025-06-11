package com.pingpong.pingpongBackend.repository;

import com.pingpong.pingpongBackend.entity.Blog;
import com.pingpong.pingpongBackend.entity.Like;
import com.pingpong.pingpongBackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LikeRepository extends JpaRepository<Like, Long> {
    boolean existsByUserAndBlog(User user, Blog blog);
    void deleteByUserAndBlog(User user, Blog blog);
    long countByBlog(Blog blog);
    List<Like> findByUser(User user);
} 