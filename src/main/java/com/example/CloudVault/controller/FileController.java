package com.example.CloudVault.controller;

import com.example.CloudVault.dto.DownloadResponse;
import com.example.CloudVault.dto.FileResponseDTO;
import com.example.CloudVault.dto.RenameFileRequest;
import com.example.CloudVault.entity.FileMetadata;
import com.example.CloudVault.service.FileService;
import jakarta.websocket.server.PathParam;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
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

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {

        DownloadResponse response = fileService.downloadFile(id);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(response.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + response.getOriginalFilename() + "\"")
                .body(response.getResource());

        // Using DownloadResponse DTO we are only returning the resource cuz browser doesn't need Json.
        // This DTO is for internal request.
    }

    @GetMapping("/{id}/delete")
    public ResponseEntity<String> deleteFile(@PathVariable Long id) {
        String msg = fileService.deleteFile(id);

        return ResponseEntity.ok()
                        .body(msg);
    }


    @GetMapping("/{id}/rename")
    public ResponseEntity<FileResponseDTO> renameFile(@PathVariable Long id, @RequestBody RenameFileRequest request) {

        FileResponseDTO fileResponseDTO = fileService.renameFile(id, request);

        return ResponseEntity.ok()
                .body(fileResponseDTO);
    }

    @GetMapping("/search")
    public ResponseEntity<List<FileResponseDTO>> searchFiles(@RequestParam String keyword) {

        List<FileResponseDTO> files = fileService.searchFiles(keyword);

        return ResponseEntity.ok()
                .body(files);

    }
}
