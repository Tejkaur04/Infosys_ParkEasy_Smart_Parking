package com.parkease.dto.parking;
 
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
 
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class CreateParkingLocationRequest {
 
    @NotBlank(message = "Name is required")
    private String name;
 
    @NotBlank(message = "Address is required")
    private String address;
 
    @NotBlank(message = "City is required")
    private String city;
 
    @NotBlank(message = "State is required")
    private String state;
 
    private String zipCode;
 
    @NotNull(message = "Latitude is required")
    @DecimalMin(value = "-90.0") @DecimalMax(value = "90.0")
    private BigDecimal latitude;
 
    @NotNull(message = "Longitude is required")
    @DecimalMin(value = "-180.0") @DecimalMax(value = "180.0")
    private BigDecimal longitude;
 
    @NotNull @Min(1)
    private Integer totalSpots;
 
    @NotNull @DecimalMin("0.01")
    private BigDecimal hourlyRate;
 
    private BigDecimal dailyRate;
    private BigDecimal monthlyRate;
 
    private boolean isCovered;
    private boolean hasEvCharging;
    private boolean hasHandicapSpots;
    private boolean hasSecurity;
    private boolean is24Hours = true;
    private String imageUrl;
}