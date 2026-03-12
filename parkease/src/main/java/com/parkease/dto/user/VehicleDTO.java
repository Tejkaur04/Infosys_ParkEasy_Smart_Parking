package com.parkease.dto.user;

import lombok.*;
import java.time.LocalDateTime;
 
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class VehicleDTO {
    private Long id;
    private String licensePlate;
    private String make;
    private String model;
    private String color;
    private String vehicleType;
    private boolean isDefault;
    private LocalDateTime createdAt;
}