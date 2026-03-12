package com.parkease.dto.parking;
 
import lombok.*;
import java.math.BigDecimal;
 
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ParkingLocationDTO {
    private Long id;
    private String name;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private int totalSpots;
    private int availableSpots;
    private BigDecimal hourlyRate;
    private BigDecimal dailyRate;
    private boolean isCovered;
    private boolean hasEvCharging;
    private boolean hasHandicapSpots;
    private boolean hasSecurity;
    private boolean is24Hours;
    private String imageUrl;
    private BigDecimal rating;
    private int totalReviews;
    private Double distanceKm; // populated for nearby searches
}