package com.parkease.dto.parking;
 
import lombok.*;
 
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ParkingSpotDTO {
    private Long id;
    private String spotNumber;
    private int floorLevel;
    private String spotType;
    private String status;
}