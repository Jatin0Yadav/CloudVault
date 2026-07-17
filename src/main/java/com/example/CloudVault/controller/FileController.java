package com.example.CloudVault.controller;

import com.example.CloudVault.dto.FileResponseDTO;
import com.example.CloudVault.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api/files")
public class FileController {

    private final FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<FileResponseDTO> upload
            (@RequestParam("file")MultipartFile file) throws IOException
    {
        return ResponseEntity.ok(fileService.uploadFile(file));

    }

    @GetMapping("/getAllFiles")
    public ResponseEntity<List<FileResponseDTO>> getAllFiles() {
        return ResponseEntity.ok(fileService.getMyFiles());

    }

}
