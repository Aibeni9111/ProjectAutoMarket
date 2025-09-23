package com.automarket.service;

import com.automarket.domain.Car;
import com.automarket.dto.CarDto;
import org.springframework.stereotype.Component;

@Component
public class CarMapper {
    public CarDto toDto(Car e) {
        return new CarDto(
            e.getId(),
            e.getMake(),
            e.getModel(),
            e.getYear(),
            e.getPriceEur(),
            e.getImageUrl(),
            e.getDescription(),
            e.getSellerUid(),
            e.getCreatedAt()
        );
    }
}
