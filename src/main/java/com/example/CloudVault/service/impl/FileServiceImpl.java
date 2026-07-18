package com.example.CloudVault.service.impl;

import com.example.CloudVault.dto.DownloadResponse;
import com.example.CloudVault.dto.FileResponseDTO;
import com.example.CloudVault.dto.RenameFileRequest;
import com.example.CloudVault.entity.FileMetadata;
import com.example.CloudVault.entity.User;
import com.example.CloudVault.repository.FileRepository;
import com.example.CloudVault.repository.UserRepository;
import com.example.CloudVault.service.FileService;
import com.example.CloudVault.service.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {

    private final FileRepository fileRepository;
    private final UserRepository userRepository;
    private final StorageService storageService;

    @Override
    public FileResponseDTO uploadFile(MultipartFile file) throws IOException {

        User owner = getCurrent();

        // Original filename
        String originalName = file.getOriginalFilename();

        // StorageService generates UUID, creates directory and stores file
        String storedFileName = storageService.upload(file);

        // Meta-data can only be generated after getting the storedFileName
        FileMetadata metadata = FileMetadata.builder()
                .originalName(originalName)
                .storedFileName(storedFileName)
                .s3Key(storedFileName)       // Later this will contain actual S3 key
                .contentType(file.getContentType())
                .size(file.getSize())
                .owner(owner)
                .build();

        FileMetadata savedFile = fileRepository.save(metadata);

        return FileResponseDTO.builder()
                .id(savedFile.getId())
                .originalName(savedFile.getOriginalName())
                .contentType(savedFile.getContentType())
                .size(savedFile.getSize())
                .uploaded_at(savedFile.getUploadedAt())
                .build();
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
                        .size(file.getSize())
                        .uploaded_at(file.getUploadedAt())
                        .build())
                .toList();
    }

    @Override
    public DownloadResponse downloadFile(Long id) {

        User user = getCurrent();

        FileMetadata file = fileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found"));

        if (!file.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to access this file.");
        }

        Resource resource = storageService.download(file.getStoredFileName());

        return DownloadResponse.builder()
                .resource(resource)
                .originalFilename(file.getOriginalName())
                .contentType(file.getContentType())
                .build();
    }

    @Override
    public String deleteFile(Long id) {

        User user = getCurrent();

        FileMetadata file = fileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File doesn't exist!"));

        if (!user.getId().equals(file.getOwner().getId())) {
            throw new RuntimeException("You are not authorised to delete the file!");
        }

        // Delete physical file
        storageService.delete(file.getStoredFileName());

        // Delete metadata
        fileRepository.delete(file);

        return "File Successfully Deleted";
    }

    @Override
    public FileResponseDTO renameFile(Long id, RenameFileRequest request) {

        User user = getCurrent();

        FileMetadata file = fileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File doesn't exist"));

        if (!file.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorised to rename the file!");
        }

        file.setOriginalName(request.getNew_name());

        FileMetadata updatedFile = fileRepository.save(file);

        return FileResponseDTO.builder()
                .id(updatedFile.getId())
                .originalName(updatedFile.getOriginalName())
                .contentType(updatedFile.getContentType())
                .size(updatedFile.getSize())
                .uploaded_at(updatedFile.getUploadedAt())
                .build();
    }

    // Helper method to fetch logged-in user
    private User getCurrent() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        String email = auth.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User doesn't exist!"));
    }
}