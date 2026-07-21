package com.example.CloudVault.util;

import com.example.CloudVault.dto.ApiResponse;

// Declaring it as final so no one can instantiate it.
// Since class has only static methods, it's a good practice to make it non instantiable.
public final class ApiResponseUtil {

    // 🔥 Careful while using Generics.
    // Just helper methods, so better to have static methods.

    public static <T> ApiResponse<T> success(String msg, T dt) {

        return ApiResponse.<T>builder()
                .message(msg)
                .data(dt)
                .build();
    }

    public static ApiResponse<Void> error(String msg) {

        return ApiResponse.<Void>builder()
                .message(msg)
                .data(null)
                .build();
    }
}