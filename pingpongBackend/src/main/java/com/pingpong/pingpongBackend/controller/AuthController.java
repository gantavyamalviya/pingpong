package com.pingpong.pingpongBackend.controller;

import com.pingpong.pingpongBackend.dto.auth.AuthResponse;
import com.pingpong.pingpongBackend.dto.auth.LoginRequest;
import com.pingpong.pingpongBackend.dto.auth.RegisterRequest;
import com.pingpong.pingpongBackend.service.AuthService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}