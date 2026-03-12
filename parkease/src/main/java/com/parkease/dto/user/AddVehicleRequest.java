package com.parkease.dto.user;

import jakarta.validation.constraints.*;
import lombok.*;
 
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class AddVehicleRequest {
 
    @NotBlank(message = "License plate is required")
    @Size(max = 20)
    private String licensePlate;
 
    @Size(max = 50)
    private String make;
 
    @Size(max = 50)
    private String model;
 
    @Size(max = 30)
    private String color;
 
    private String vehicleType; // COMPACT, SEDAN, SUV, TRUCK, MOTORCYCLE, ELECTRIC
 
    private boolean isDefault = false;
}