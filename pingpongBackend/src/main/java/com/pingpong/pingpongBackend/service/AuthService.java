package com.pingpong.pingpongBackend.service;

import com.pingpong.pingpongBackend.dto.LoginRequest;
import com.pingpong.pingpongBackend.dto.SignupRequest;
import com.pingpong.pingpongBackend.exceptions.InvalidCredentialsException;
import com.pingpong.pingpongBackend.exceptions.UserAlreadyExistsException;
import com.pingpong.pingpongBackend.model.User;
import com.pingpong.pingpongBackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public String signup(SignupRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("Email already in use!");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);
        return "Signup successful!";
    }

    public String login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password!"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password!");
        }

        return "Login successful!";
    }
}
