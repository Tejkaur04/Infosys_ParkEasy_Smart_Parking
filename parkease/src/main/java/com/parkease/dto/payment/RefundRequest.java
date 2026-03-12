package com.parkease.dto.payment;

import lombok.*;
import java.math.BigDecimal;
 
@Data @NoArgsConstructor @AllArgsConstructor
public class RefundRequest {
    private BigDecimal amount;  // null = full refund
    private String reason;
}