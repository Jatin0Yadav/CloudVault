package com.example.CloudVault.service;

import com.example.CloudVault.dto.LoginRequest;
import com.example.CloudVault.dto.LoginResponse;
import com.example.CloudVault.dto.RegisterRequest;
import com.example.CloudVault.dto.RegisterResponse;
import com.example.CloudVault.entity.Role;
import com.example.CloudVault.entity.User;
import com.example.CloudVault.exception.EmailAlreadyExistsException;
import com.example.CloudVault.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    public RegisterResponse register(RegisterRequest request) {

        if(userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email Already Exists!");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))        // saved the encoded password to the database.
                .role(Role.USER)            // giving the role here.
                .build();

        User savedUser = userRepository.save(user);

        RegisterResponse response = RegisterResponse.builder()
                .id(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .build();

        return response;
    }


//    public LoginResponse login(@RequestBody LoginRequest request) {
//
//    }

}
