package com.automarket.exception;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex,
                                                     HttpServletRequest req) {
        var fields = ex.getBindingResult().getFieldErrors().stream()
            .map(f -> new ApiError.FieldError(f.getField(), f.getDefaultMessage()))
            .toList();

        var body = new ApiError(
            "ValidationError",
            "Validation failed",
            HttpStatus.BAD_REQUEST.value(),
            req.getRequestURI(),
            OffsetDateTime.now(),
            fields
        );
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiError> handleConstraint(ConstraintViolationException ex,
                                                     HttpServletRequest req) {
        var fields = ex.getConstraintViolations().stream()
            .map(v -> new ApiError.FieldError(v.getPropertyPath().toString(), v.getMessage()))
            .toList();

        var body = new ApiError(
            "ConstraintViolation",
            "Validation failed",
            HttpStatus.BAD_REQUEST.value(),
            req.getRequestURI(),
            OffsetDateTime.now(),
            fields
        );
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<ApiError> handleNotFound(NoSuchElementException ex,
                                                   HttpServletRequest req) {
        var body = new ApiError(
            "NotFound",
            ex.getMessage(),
            HttpStatus.NOT_FOUND.value(),
            req.getRequestURI(),
            OffsetDateTime.now(),
            null
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleAny(Exception ex, HttpServletRequest req) {
        var body = new ApiError(
            "InternalError",
            "Unexpected error",
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            req.getRequestURI(),
            OffsetDateTime.now(),
            null
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}
