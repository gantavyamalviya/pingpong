package com.pingpong.pingpongBackend.service;

import com.pingpong.pingpongBackend.dto.BlogResponse;
import com.pingpong.pingpongBackend.dto.CommentResponse;
import com.pingpong.pingpongBackend.dto.UserProfileRequest;
import com.pingpong.pingpongBackend.dto.AuthorDTO;
import com.pingpong.pingpongBackend.dto.PublicUserProfileDTO;
import com.pingpong.pingpongBackend.entity.Blog;
import com.pingpong.pingpongBackend.entity.Like;
import com.pingpong.pingpongBackend.entity.User;
import com.pingpong.pingpongBackend.repository.BlogRepository;
import com.pingpong.pingpongBackend.repository.CommentRepository;
import com.pingpong.pingpongBackend.repository.LikeRepository;
import com.pingpong.pingpongBackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;
    private final BlogRepository blogRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;

    @Transactional
    public User updateProfile(User user, UserProfileRequest request) {
        user.setFullName(request.getFullName());
        user.setBio(request.getBio());
        user.setProfilePicture(request.getProfilePicture());
        return userRepository.save(user);
    }

    public List<BlogResponse> getLikedBlogs(User user) {
        List<Like> likes = likeRepository.findByUser(user);
        return likes.stream()
                .map(like -> toBlogResponse(like.getBlog()))
                .collect(Collectors.toList());
    }

    public List<CommentResponse> getUserComments(User user) {
        return commentRepository.findByAuthor(user).stream()
                .map(comment -> {
                    CommentResponse resp = new CommentResponse();
                    resp.setId(comment.getId());
                    resp.setContent(comment.getContent());
                    resp.setAuthorUsername(user.getUsername());
                    resp.setCreatedAt(comment.getCreatedAt());
                    resp.setBlogId(comment.getBlog().getId());
                    return resp;
                })
                .collect(Collectors.toList());
    }

    private BlogResponse toBlogResponse(Blog blog) {
        BlogResponse resp = new BlogResponse();
        resp.setId(blog.getId());
        resp.setTitle(blog.getTitle());
        resp.setContent(blog.getContent());
        resp.setImageUrl(blog.getImageUrl());
        resp.setAuthor(toAuthorDTO(blog.getAuthor()));
        resp.setCreatedAt(blog.getCreatedAt());
        resp.setUpdatedAt(blog.getUpdatedAt());
        resp.setLikeCount((int) likeRepository.countByBlog(blog));
        resp.setCommentCount((int) commentRepository.countByBlog(blog));
        return resp;
    }

    private AuthorDTO toAuthorDTO(User user) {
        AuthorDTO dto = new AuthorDTO();
        dto.setUsername(user.getUsername());
        dto.setFullName(user.getFullName());
        dto.setProfilePicture(user.getProfilePicture());
        return dto;
    }

    @Transactional
    public void followUser(User currentUser, String usernameToFollow) {
        log.info("[FOLLOW] {} -> {} (before)", currentUser.getUsername(), usernameToFollow);
        if (currentUser.getUsername().equals(usernameToFollow)) return;
        User userToFollow = userRepository.findByUsername(usernameToFollow)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userToFollow.getFollowers().add(currentUser);
        userRepository.save(userToFollow);
        log.info("[FOLLOW] {} -> {} (after)", currentUser.getUsername(), usernameToFollow);
    }

    @Transactional
    public void unfollowUser(User currentUser, String usernameToUnfollow) {
        if (currentUser.getUsername().equals(usernameToUnfollow)) return;
        User userToUnfollow = userRepository.findByUsername(usernameToUnfollow)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userToUnfollow.getFollowers().removeIf(follower -> follower.getUsername().equals(currentUser.getUsername()));
        userRepository.save(userToUnfollow);
    }

    @Transactional(readOnly = true)
    public long getFollowersCount(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getFollowers().size();
    }

    @Transactional(readOnly = true)
    public long getFollowingCount(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getFollowing().size();
    }

    @Transactional(readOnly = true)
    public boolean isFollowing(User currentUser, String username) {
        if (currentUser == null || currentUser.getUsername().equals(username)) return false;
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getFollowers().stream()
            .anyMatch(follower -> follower.getUsername().equals(currentUser.getUsername()));
    }

    @Transactional(readOnly = true)
    public List<PublicUserProfileDTO> getFollowers(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getFollowers().stream().map(this::toPublicUserProfileDTO).toList();
    }

    @Transactional(readOnly = true)
    public List<PublicUserProfileDTO> getFollowing(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getFollowing().stream().map(this::toPublicUserProfileDTO).toList();
    }

    private PublicUserProfileDTO toPublicUserProfileDTO(User user) {
        PublicUserProfileDTO dto = new PublicUserProfileDTO();
        dto.setUsername(user.getUsername());
        dto.setFullName(user.getFullName());
        dto.setBio(user.getBio());
        dto.setProfilePicture(user.getProfilePicture());
        return dto;
    }
} 