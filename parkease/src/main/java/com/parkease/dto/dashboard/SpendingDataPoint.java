package com.parkease.dto.dashboard;

import lombok.*;
import java.math.BigDecimal;
 
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class SpendingDataPoint {
    private String month;      // e.g., "Jan 2024"
    private BigDecimal amount;
    private int bookingCount;
}