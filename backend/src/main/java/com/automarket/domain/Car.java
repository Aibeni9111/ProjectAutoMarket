package com.automarket.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

// Русский коммент: JPA-сущность соответствует таблице car
@Entity
@Table(name = "car")
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 64)
    private String make;

    @Column(nullable = false, length = 64)
    private String model;

    @Column(nullable = false)
    private int year;

    @Column(name = "price_eur", nullable = false)
    private int priceEur;

    @Column(name = "image_url", nullable = false, columnDefinition = "text")
    private String imageUrl;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "description", columnDefinition = "text")
    private String description;

    // region getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMake() { return make; }
    public void setMake(String make) { this.make = make; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }

    public int getPriceEur() { return priceEur; }
    public void setPriceEur(int priceEur) { this.priceEur = priceEur; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }


    @Column(name = "seller_uid", length = 64)
    private String sellerUid;

    public String getSellerUid() { return sellerUid; }
    public void setSellerUid(String sellerUid) { this.sellerUid = sellerUid; }


}
