package com.pingpong.pingpongBackend.dto;

import com.pingpong.pingpongBackend.entity.User;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BlogResponse {
    private Long id;
    private String title;
    private String content;
    private String imageUrl;
    private User author;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 