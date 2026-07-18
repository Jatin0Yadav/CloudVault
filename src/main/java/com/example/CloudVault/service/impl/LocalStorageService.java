package com.example.CloudVault.service.impl;

import com.example.CloudVault.service.StorageService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;


// for on system operations.
@Service
public class LocalStorageService implements StorageService {

    private static final String UPLOAD_DIR = "uploads";

    @Override
    public String upload(MultipartFile file) throws IOException {

        String originalName = file.getOriginalFilename();

        String extension = "";

        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf("."));
        }

        String storedFileName = UUID.randomUUID() + extension;

        Path uploadPath = Paths.get(UPLOAD_DIR);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(storedFileName);

        Files.copy(file.getInputStream(), filePath);

        return storedFileName;
    }

    @Override
    public Resource download(String storedFileName) {

        try {

            Path filePath = Paths.get(UPLOAD_DIR).resolve(storedFileName);

            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                throw new RuntimeException("File not found.");
            }

            return resource;

        } catch (Exception e) {
            throw new RuntimeException("Could not download file.", e);
        }
    }

    @Override
    public void delete(String storedFileName) {

        try {

            Path filePath = Paths.get(UPLOAD_DIR).resolve(storedFileName);

            Files.deleteIfExists(filePath);

        } catch (IOException e) {

            throw new RuntimeException("Could not delete file.", e);

        }

    }
}