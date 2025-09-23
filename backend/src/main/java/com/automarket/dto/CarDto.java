package com.automarket.dto;

public record CarDto(
    Long id,
    String make,
    String model,
    int year,
    int priceEur,
    String imageUrl,
    String description,
    String sellerUid,
    java.time.OffsetDateTime createdAt
) {}
