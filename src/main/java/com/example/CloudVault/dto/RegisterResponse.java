package com.example.CloudVault.dto;

import com.example.CloudVault.entity.Role;
import lombok.*;
import org.springframework.web.service.annotation.GetExchange;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterResponse {

    private Long id;

    private String name;

    private String email;

    private Role role;

}
