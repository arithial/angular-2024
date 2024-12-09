package com.arithial.bookclub.server.impl;

import com.fasterxml.jackson.databind.RuntimeJsonMappingException;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(org.springframework.http.HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeJsonMappingException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
