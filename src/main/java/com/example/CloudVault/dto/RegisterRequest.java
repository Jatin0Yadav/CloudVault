package com.example.CloudVault.dto;

// the client sends request to register
// includes only the things, sent by user during registering.

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {

    private String name;

    private String email;

    private String password;
}
