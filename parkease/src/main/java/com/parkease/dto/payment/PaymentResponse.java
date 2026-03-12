package com.parkease.dto.payment;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
 
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class PaymentResponse {
    private boolean success;
    private String paymentReference;
    private String transactionId;
    private BigDecimal amount;
    private String currency;
    private String message;
    private LocalDateTime processedAt;
}
