package com.parkease.entity;
 
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
 
@Entity @Table(name = "parking_locations")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ParkingLocation {
 
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    @Column(nullable = false) private String name;
    @Column(nullable = false) private String address;
    @Column(nullable = false) private String city;
    @Column(nullable = false) private String state;
    private String zipCode;
 
    @Column(nullable = false) private BigDecimal latitude;
    @Column(nullable = false) private BigDecimal longitude;
 
    private int totalSpots;
    private int availableSpots;
 
    @Column(nullable = false) private BigDecimal hourlyRate;
    private BigDecimal dailyRate;
    private BigDecimal monthlyRate;
 
    private boolean isCovered;
    private boolean hasEvCharging;
    private boolean hasHandicapSpots;
    private boolean hasSecurity;
    private boolean is24Hours = true;
    private String imageUrl;
 
    @Column(precision = 3, scale = 2)
    private BigDecimal rating = BigDecimal.ZERO;
    private int totalReviews;
 
    private boolean isActive = true;
 
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
 
    @PrePersist protected void onCreate() { createdAt = updatedAt = LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { updatedAt = LocalDateTime.now(); }
}
 
 
