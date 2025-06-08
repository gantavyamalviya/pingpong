package com.pingpong.pingpongBackend.repository;

import com.pingpong.pingpongBackend.entity.Blog;
import com.pingpong.pingpongBackend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlogRepository extends JpaRepository<Blog, Long> {
    Page<Blog> findByAuthor(User author, Pageable pageable);
    Page<Blog> findByAuthorIn(Iterable<User> authors, Pageable pageable);
} 