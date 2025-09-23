package com.automarket.exception;

import java.time.OffsetDateTime;
import java.util.List;


public record ApiError(
    String error,
    String message,
    int status,
    String path,
    OffsetDateTime timestamp,
    List<FieldError> details
) {
    public record FieldError(String field, String message) {}
}
