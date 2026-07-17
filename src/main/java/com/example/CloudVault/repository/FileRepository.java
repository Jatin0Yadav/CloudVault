package com.example.CloudVault.repository;

import com.example.CloudVault.entity.FileMetadata;
import com.example.CloudVault.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileRepository extends JpaRepository<FileMetadata, Long> {

    // To list all the files of one owner
    List<FileMetadata> findByOwner(User owner);

    // To fetch only one file of given user.
    // Cuz two users can have same file_name and even id, cuz we are maintaining all the files in one db.
    Optional<FileMetadata> findByIdAndOwner(Long id, User owner);
}
