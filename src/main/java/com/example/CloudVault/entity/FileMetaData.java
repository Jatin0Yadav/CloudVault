package com.example.CloudVault.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Audited;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name="files")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class FileMetaData {

    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String originalName;

    @Column(nullable = false)
    private String storedFileName;

    @Column(nullable = false)
    private String s3Key;

    @Column(nullable = false)
    private String contentType;

    @Column(nullable = false)
    private Long size;

    @CreationTimestamp
    @Column(name="uploaded_at", nullable = false, updatable = false)
    private LocalDateTime uploadedAt;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="user_id", nullable = false)
    private User owner;

}
