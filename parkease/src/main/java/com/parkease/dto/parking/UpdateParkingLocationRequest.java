package com.parkease.dto.parking;
 
import lombok.*;
import java.math.BigDecimal;
 
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class UpdateParkingLocationRequest {
    private String name;
    private String address;
    private BigDecimal hourlyRate;
    private BigDecimal dailyRate;
    private Boolean isCovered;
    private Boolean hasEvCharging;
    private Boolean hasSecurity;
    private Boolean is24Hours;
    private Boolean isActive;
}