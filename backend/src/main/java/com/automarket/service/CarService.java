package com.automarket.service;

import com.automarket.domain.Car;
import com.automarket.dto.CarCreateDto;
import com.automarket.dto.CarDto;
import com.automarket.dto.CarUpdateDto;
import com.automarket.repository.CarRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CarService {

    private final CarRepository repo;
    private final CarMapper mapper;

    public CarService(CarRepository repo, CarMapper mapper) {
        this.repo = repo;
        this.mapper = mapper;
    }

    public Page<CarDto> findAll(
        String make, Integer yearFrom, Integer yearTo,
        Integer priceFrom, Integer priceTo, Pageable pageable
    ) {
        Specification<Car> spec = (root, q, cb) -> cb.conjunction();

        if (make != null && !make.isBlank()) {
            spec = spec.and((root, q, cb) ->
                cb.like(cb.lower(root.get("make")), "%" + make.toLowerCase() + "%"));
        }
        if (yearFrom != null) {
            spec = spec.and((r, q, cb) -> cb.greaterThanOrEqualTo(r.get("year"), yearFrom));
        }
        if (yearTo != null) {
            spec = spec.and((r, q, cb) -> cb.lessThanOrEqualTo(r.get("year"), yearTo));
        }
        if (priceFrom != null) {
            spec = spec.and((r, q, cb) -> cb.greaterThanOrEqualTo(r.get("priceEur"), priceFrom));
        }
        if (priceTo != null) {
            spec = spec.and((r, q, cb) -> cb.lessThanOrEqualTo(r.get("priceEur"), priceTo));
        }

        return repo.findAll(spec, pageable).map(mapper::toDto);
    }


    public java.util.Optional<CarDto> findById(Long id) {
        return repo.findById(id).map(this::toDto);
    }


    public CarDto create(CarCreateDto dto) {
        Car e = new Car();
        e.setMake(dto.make());
        e.setModel(dto.model());
        e.setYear(dto.year());
        e.setPriceEur(dto.priceEur());
        e.setImageUrl(dto.imageUrl());
        e.setDescription(dto.description());

        // Русский коммент: владелец = текущий Firebase UID
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String uid = (auth != null) ? String.valueOf(auth.getPrincipal()) : null;
        e.setSellerUid(uid);

        e = repo.save(e);
        return mapper.toDto(e);
    }


    public CarDto update(Long id, CarUpdateDto dto) {
        var e = repo.findById(id).orElseThrow();
        assertOwnerOrAdmin(e);
        e.setMake(dto.make());
        e.setModel(dto.model());
        e.setYear(dto.year());
        e.setPriceEur(dto.priceEur());
        e.setImageUrl(dto.imageUrl());
        e.setDescription(dto.description());
        e = repo.save(e);
        return mapper.toDto(e);
    }



    public void delete(Long id) {
        var e = repo.findById(id).orElseThrow();
        assertOwnerOrAdmin(e);
        repo.delete(e);
    }


    private CarDto toDto(Car c) {
        return new CarDto(
            c.getId(),
            c.getMake(),
            c.getModel(),
            c.getYear(),
            c.getPriceEur(),
            c.getImageUrl(),
            c.getDescription(),
            c.getSellerUid(),
            c.getCreatedAt()
        );
    }

    private boolean isAdmin(Authentication auth) {
        return auth != null && auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    private void assertOwnerOrAdmin(Car e) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) throw new org.springframework.security.access.AccessDeniedException("No auth");
        String uid = String.valueOf(auth.getPrincipal());
        if (isAdmin(auth)) return;
        if (e.getSellerUid() == null || !e.getSellerUid().equals(uid)) {
            throw new org.springframework.security.access.AccessDeniedException("Not owner");
        }
    }

}
