package com.parkease.entity;
 
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
 
@Entity @Table(name = "vehicles")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Vehicle {
 
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
 
    @Column(name = "license_plate", nullable = false)
    private String licensePlate;
 
    private String make;
    private String model;
    private String color;
 
    @Enumerated(EnumType.STRING)
    private VehicleType vehicleType = VehicleType.SEDAN;
 
    private boolean isDefault = false;
    private LocalDateTime createdAt;
 
    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); }
 
    public enum VehicleType { COMPACT, SEDAN, SUV, TRUCK, MOTORCYCLE, ELECTRIC }
}
 