package com.example.CloudVault.service;

import com.example.CloudVault.entity.User;
import com.example.CloudVault.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

public class UserServiceImp implements UserService {

    @Autowired
    UserRepository userRepository;

    @Override
    public boolean register(User User) {
        userRepository.save(User);
        return false;
    }
}
