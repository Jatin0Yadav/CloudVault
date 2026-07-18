package com.example.CloudVault.dto;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RenameFileRequest {

    private String new_name;
}
