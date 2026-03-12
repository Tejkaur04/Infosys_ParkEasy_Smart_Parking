package com.parkease.entity;
 
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
 
@Entity @Table(name = "payments")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Payment {
 
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    @Column(name = "payment_reference", unique = true, nullable = false)
    private String paymentReference;
 
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;
 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
 
    @Column(nullable = false) private BigDecimal amount;
    private String currency = "USD";
 
    @Enumerated(EnumType.STRING) private PaymentMethod paymentMethod;
    @Enumerated(EnumType.STRING) private PaymentStatus paymentStatus = PaymentStatus.PENDING;
 
    private String transactionId;
    private String cardLastFour;
    private String cardBrand;
    private BigDecimal refundAmount = BigDecimal.ZERO;
    private LocalDateTime paidAt;
 
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
 
    @PrePersist protected void onCreate() { createdAt = updatedAt = LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { updatedAt = LocalDateTime.now(); }
 
    public enum PaymentMethod { CREDIT_CARD, DEBIT_CARD, PAYPAL, WALLET, UPI }
    public enum PaymentStatus { PENDING, PROCESSING, COMPLETED, FAILED, REFUNDED }
}
 