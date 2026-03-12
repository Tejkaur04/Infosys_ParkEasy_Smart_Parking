package com.parkease.dto.booking;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
 
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class BookingDTO {
    private Long id;
    private String bookingReference;
    private Long spotId;
    private String spotNumber;
    private Long locationId;
    private String locationName;
    private String locationAddress;
    private Long vehicleId;
    private String vehiclePlate;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime actualEndTime;
    private String status;
    private BigDecimal totalAmount;
    private BigDecimal durationHours;
    private String notes;
    private String qrCodeUrl;
    private LocalDateTime cancelledAt;
    private String cancellationReason;
    private LocalDateTime createdAt;
}
