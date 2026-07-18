package com.example.CloudVault.service.impl;

import com.example.CloudVault.dto.DownloadResponse;
import com.example.CloudVault.dto.FileResponseDTO;
import com.example.CloudVault.entity.FileMetadata;
import com.example.CloudVault.entity.User;
import com.example.CloudVault.repository.FileRepository;
import com.example.CloudVault.repository.UserRepository;
import com.example.CloudVault.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {

    private final FileRepository fileRepository;
    private final UserRepository userRepository;

    private final String UPLOAD_DIR = "CloudVault/uploads/";

    @Override
    public FileResponseDTO uploadFile(MultipartFile file) throws IOException {

        User owner = getCurrent();

        // Original filename
        String originalName = file.getOriginalFilename();

        // Generate unique filename
        String storedFileName = UUID.randomUUID() + "_" + originalName;

        Path uploadPath = Paths.get(UPLOAD_DIR);

        // Create uploads folder if it doesn't exist
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // uploads/UUID_resume.pdf
        Path filePath = uploadPath.resolve(storedFileName);

        // Copy file bytes to disk
        Files.copy(file.getInputStream(), filePath);


        FileMetadata metadata = FileMetadata.builder()
                .originalName(originalName)
                .storedFileName(storedFileName)
                // Later this will contain the S3 object key.
                .s3Key(filePath.toString())
                // MIME type
                .contentType(file.getContentType())
                .size(file.getSize())
                .owner(owner)
                .build();

        FileMetadata savedFile = fileRepository.save(metadata);


        FileResponseDTO response = new FileResponseDTO();

        response.setId(savedFile.getId());
        response.setOriginalName(savedFile.getOriginalName());
        response.setContentType(savedFile.getContentType());
        response.setSize(savedFile.getSize());
        response.setUploaded_at(savedFile.getUploadedAt());


        return response;
    }


    @Override
    public List<FileResponseDTO> getMyFiles() {

        User user = getCurrent();

        List<FileMetadata> myFiles = fileRepository.findByOwner(user);

        return myFiles.stream()
                .map(file -> FileResponseDTO.builder()
                        .id(file.getId())
                        .originalName(file.getOriginalName())
                        .contentType(file.getContentType())
                        .uploaded_at(file.getUploadedAt())
                        .build()
                ).toList();

    }

    @Override
    public DownloadResponse downloadFile(Long id) {

        // Get currently logged-in user
        User user = getCurrent();


        // Find the file in the database
        FileMetadata file = fileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found"));

        // Verify that the logged-in user owns the file
        if (!file.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to access this file.");
        }

        try {

            // Create the complete path of the file on disk
            Path path = Paths.get(UPLOAD_DIR, file.getStoredFileName());

            // Wrap the file into a Spring Resource
            Resource resource = new UrlResource(path.toUri());

            // Check if the file actually exists
            if (!resource.exists()) {
                throw new RuntimeException("File not found on disk.");
            }

            // Return everything required by the controller
            return DownloadResponse.builder()
                    .resource(resource)
                    .originalFilename(file.getOriginalName())
                    .contentType(file.getContentType())
                    .build();

        } catch (MalformedURLException e) {
            throw new RuntimeException("Unable to read file.", e);
        }
    }

    @Override
    public String deleteFile(Long id) {

        User user = getCurrent();

        FileMetadata file = fileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File doesn't exist!"));

        if(!user.getId().equals(file.getOwner().getId())) {
            throw new RuntimeException("You are not authorised to delete the file!");
        }

        try {
            Path path = Paths.get(UPLOAD_DIR, file.getOriginalName());

            Files.deleteIfExists(path);

            fileRepository.delete(file);        // deleting metadata from the pg.

            return "File Successfully Deleted";

        } catch (IOException e) {
            throw new RuntimeException("Unable to delete the file " + e.getMessage());
        }
    }

    public User getCurrent() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        assert auth != null;
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User doesn't exist!"));
    }
}
