package com.example.CloudVault.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface StorageService {

    String upload(MultipartFile file) throws IOException;

    Resource download(String storedFileName);

    void delete(String storedFileName);

}