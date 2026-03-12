package com.parkease.dto.booking;

import lombok.*;
import java.math.BigDecimal;
 
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class BookingStatsDTO {
    private long totalBookings;
    private long completedBookings;
    private long activeBookings;
    private long cancelledBookings;
    private BigDecimal totalSpent;
    private BigDecimal totalHoursParked;
    private String mostVisitedLocation;
}