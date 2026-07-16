package com.example.CloudVault.controller;

import com.example.CloudVault.dto.*;
import com.example.CloudVault.entity.User;
import com.example.CloudVault.service.AuthService;
import com.example.CloudVault.util.ApiResponseUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegisterResponse>> register(@RequestBody RegisterRequest request) {

        RegisterResponse response = authService.register(request);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseUtil.success("User Registered Successfully", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequest request) {

        LoginResponse response = authService.login(request);


        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseUtil.success("Login Successful", response));
    }
}
