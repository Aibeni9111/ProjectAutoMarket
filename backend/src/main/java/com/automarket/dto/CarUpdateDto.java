package com.automarket.dto;

import jakarta.validation.constraints.*;

public record CarUpdateDto(
    @NotBlank String make,
    @NotBlank String model,
    @Min(1950) @Max(2100) int year,
    @Min(0) int priceEur,
    @NotBlank String imageUrl,
    @Size(max = 2000) String description
) {}
