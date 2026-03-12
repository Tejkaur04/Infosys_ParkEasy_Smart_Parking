package com.parkease.dto.booking;
 
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;
 
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class CreateBookingRequest {
 
    @NotNull(message = "Spot ID is required")
    private Long spotId;
 
    private Long vehicleId;
 
    @NotNull(message = "Start time is required")
    @Future(message = "Start time must be in the future")
    private LocalDateTime startTime;
 
    @NotNull(message = "End time is required")
    private LocalDateTime endTime;
 
    private String notes;
}