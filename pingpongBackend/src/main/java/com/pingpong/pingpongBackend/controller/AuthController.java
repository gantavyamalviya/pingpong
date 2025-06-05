package com.pingpong.pingpongBackend.controller;

import com.pingpong.pingpongBackend.dto.LoginRequest;
import com.pingpong.pingpongBackend.dto.SignupRequest;
import com.pingpong.pingpongBackend.service.AuthService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public String signup(@RequestBody SignupRequest request) {
        return authService.signup(request);
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}