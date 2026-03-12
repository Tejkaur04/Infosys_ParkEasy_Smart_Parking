package com.parkease.entity;
 
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
 
@Entity @Table(name = "bookings")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Booking {
 
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    @Column(name = "booking_reference", unique = true, nullable = false)
    private String bookingReference;
 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "spot_id", nullable = false)
    private ParkingSpot spot;
 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;
 
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime actualEndTime;
 
    @Enumerated(EnumType.STRING)
    private BookingStatus status = BookingStatus.PENDING;
 
    private BigDecimal totalAmount;
    private BigDecimal durationHours;
    private String notes;
    private LocalDateTime cancelledAt;
    private String cancellationReason;
 
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
 
    @PrePersist protected void onCreate() { createdAt = updatedAt = LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { updatedAt = LocalDateTime.now(); }
 
    public enum BookingStatus { PENDING, CONFIRMED, ACTIVE, COMPLETED, CANCELLED, NO_SHOW }
}
 
 