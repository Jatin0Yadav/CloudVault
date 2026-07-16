package com.example.CloudVault.repository;

import com.example.CloudVault.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Only these methods are in JpaRepo, so other we will have to declare here.
//    save()
//    findById()
//    findAll()
//    delete()
//    deleteById()
//    count()
//    existsById()
//    flush()
//    saveAll()

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
