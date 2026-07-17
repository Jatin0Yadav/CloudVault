package com.example.CloudVault.controller;

import com.example.CloudVault.dto.FileResponseDTO;
import com.example.CloudVault.entity.FileMetadata;
import com.example.CloudVault.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api/files")
public class FileController {

    private final FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<FileResponseDTO> upload
            (@RequestParam("file")MultipartFile file) throws IOException
    {

        FileResponseDTO uploaded_file = fileService.uploadFile(file);
        return ResponseEntity.ok(uploaded_file);

    }

}
