package com.example.CloudVault.dto;


import lombok.*;
import org.springframework.core.io.Resource;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

// using this, cuz we want more than file resource, we want more_info, orElse originalFilename will get lost
public class DownloadResponse {

    private Resource resource;

    private String originalFilename;

    private String contentType;
}

