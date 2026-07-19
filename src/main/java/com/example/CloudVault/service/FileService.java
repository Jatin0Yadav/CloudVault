package com.example.CloudVault.service;

import com.example.CloudVault.dto.DownloadResponse;
import com.example.CloudVault.dto.FileResponseDTO;
import com.example.CloudVault.dto.RenameFileRequest;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

// Including the methods, of all operation we want to do, and accordingly adds the methods in the repository
// We also add some method which are not in JpaRepository.
public interface FileService {

    // Exceptions are also mentioned while mentioning methods in Interfaces.
    FileResponseDTO uploadFile(MultipartFile file) throws IOException;

    List<FileResponseDTO> getMyFiles();

//  Spring cannot send a java.io.File directly in an HTTP response.
//  Instead, it expects a Resource.
    DownloadResponse downloadFile(Long file_id);

    String deleteFile(Long file_id);

    FileResponseDTO renameFile(Long file_id, RenameFileRequest request);

    List<FileResponseDTO> searchFiles(String keyword);
}
