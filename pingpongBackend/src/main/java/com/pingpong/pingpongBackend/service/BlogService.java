package com.pingpong.pingpongBackend.service;

import com.pingpong.pingpongBackend.dto.BlogRequest;
import com.pingpong.pingpongBackend.dto.BlogResponse;
import com.pingpong.pingpongBackend.dto.PaginatedResponse;
import com.pingpong.pingpongBackend.entity.Blog;
import com.pingpong.pingpongBackend.entity.User;
import com.pingpong.pingpongBackend.exception.ResourceNotFoundException;
import com.pingpong.pingpongBackend.repository.BlogRepository;
import com.pingpong.pingpongBackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlogService {
    private final BlogRepository blogRepository;
    private final UserRepository userRepository;

    @Transactional
    public BlogResponse publishBlog(BlogRequest request, String username) {
        User author = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Blog blog = new Blog();
        blog.setTitle(request.getTitle());
        blog.setContent(request.getContent());
        blog.setImageUrl(request.getImageUrl());
        blog.setAuthor(author);

        Blog saved = blogRepository.save(blog);
        return toResponse(saved);
    }

    public List<BlogResponse> getAllBlogs() {
        return blogRepository.findAll().stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public BlogResponse getBlogById(Long id) {
        Blog blog = blogRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Blog not found"));
        return toResponse(blog);
    }

    @Transactional
    public BlogResponse updateBlog(Long id, BlogRequest request, String username) throws AccessDeniedException {
        Blog blog = blogRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Blog not found"));
        if (!blog.getAuthor().getUsername().equals(username)) {
            throw new AccessDeniedException("You are not the author of this blog");
        }
        blog.setTitle(request.getTitle());
        blog.setContent(request.getContent());
        blog.setImageUrl(request.getImageUrl());
        Blog updated = blogRepository.save(blog);
        return toResponse(updated);
    }

    @Transactional
    public void deleteBlog(Long id, String username) throws AccessDeniedException {
        Blog blog = blogRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Blog not found"));
        if (!blog.getAuthor().getUsername().equals(username)) {
            throw new AccessDeniedException("You are not the author of this blog");
        }
        blogRepository.delete(blog);
    }

    public List<BlogResponse> getBlogsByUser(String username) {
        return blogRepository.findAll().stream()
            .filter(blog -> blog.getAuthor().getUsername().equals(username))
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public PaginatedResponse<BlogResponse> getBlogsPaginated(int page, int size) {
        Page<Blog> blogPage = blogRepository.findAll(PageRequest.of(page, size));
        PaginatedResponse<BlogResponse> response = new PaginatedResponse<>();
        response.setContent(blogPage.getContent().stream().map(this::toResponse).collect(Collectors.toList()));
        response.setTotalPages(blogPage.getTotalPages());
        response.setTotalElements(blogPage.getTotalElements());
        response.setSize(blogPage.getSize());
        response.setNumber(blogPage.getNumber());
        return response;
    }

    private BlogResponse toResponse(Blog blog) {
        BlogResponse resp = new BlogResponse();
        resp.setId(blog.getId());
        resp.setTitle(blog.getTitle());
        resp.setContent(blog.getContent());
        resp.setImageUrl(blog.getImageUrl());
        resp.setAuthor(blog.getAuthor());
        resp.setCreatedAt(blog.getCreatedAt());
        resp.setUpdatedAt(blog.getUpdatedAt());
        return resp;
    }
} 