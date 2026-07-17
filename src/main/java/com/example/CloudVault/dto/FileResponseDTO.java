package com.example.CloudVault.dto;

import com.example.CloudVault.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileResponseDTO {

    private Long id;

    private String originalName;

    private String contentType;

    private Long size;

    @CreationTimestamp
    private LocalDateTime uploaded_at;

}
