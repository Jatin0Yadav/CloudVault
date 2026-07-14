package com.example.CloudVault.controller;

import com.example.CloudVault.dto.LoginRequest;
import com.example.CloudVault.dto.LoginResponse;
import com.example.CloudVault.dto.RegisterRequest;
import com.example.CloudVault.dto.RegisterResponse;
import com.example.CloudVault.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public RegisterResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

//    @PostMapping("/login")
//    public LoginResponse login(@RequestBody LoginRequest request) {
//
//    }
}
