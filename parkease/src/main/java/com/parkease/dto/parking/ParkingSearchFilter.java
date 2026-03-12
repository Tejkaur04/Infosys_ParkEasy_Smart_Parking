package com.parkease.dto.parking;
 
import lombok.*;
 
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ParkingSearchFilter {
    private String city;
    private String query;
    private Boolean hasEvCharging;
    private Boolean isCovered;
    private Boolean hasSecurity;
    private Boolean is24Hours;
    private Double maxRate;
    private Double latitude;
    private Double longitude;
    private double radiusKm = 5.0;
}
