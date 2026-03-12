package com.parkease.dto.payment;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
 
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class PaymentDTO {
    private Long id;
    private String paymentReference;
    private Long bookingId;
    private String bookingReference;
    private BigDecimal amount;
    private String currency;
    private String paymentMethod;
    private String paymentStatus;
    private String transactionId;
    private String cardLastFour;
    private String cardBrand;
    private BigDecimal refundAmount;
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;
}