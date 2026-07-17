package com.example.CloudVault.service;

import com.example.CloudVault.dto.FileResponseDTO;
import com.example.CloudVault.entity.FileMetadata;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface FileService {

    // Including the methods, of all operation we want to do, and accordingly adds the methods in the repository
    // We also add some method which are not in JpaRepository.

    // Exceptions are also mentioned while mentioning methods in Interfaces.
    FileResponseDTO uploadFile(MultipartFile file) throws IOException;

    List<FileResponseDTO> getMyFiles();

}
