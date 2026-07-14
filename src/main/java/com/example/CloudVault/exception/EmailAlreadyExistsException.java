package com.example.CloudVault.exception;


public class EmailAlreadyExistsException extends RuntimeException{

    public EmailAlreadyExistsException(String msg) {
        super(msg);
    }
}
