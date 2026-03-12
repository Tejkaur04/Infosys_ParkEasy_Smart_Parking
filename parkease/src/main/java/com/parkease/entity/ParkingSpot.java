package com.parkease.entity;
 
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
 
@Entity @Table(name = "parking_spots")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ParkingSpot {
 
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    private ParkingLocation location;
 
    @Column(name = "spot_number", nullable = false) private String spotNumber;
    @Column(name = "floor_level") private int floorLevel = 1;
 
    @Enumerated(EnumType.STRING) private SpotType spotType = SpotType.STANDARD;
    @Enumerated(EnumType.STRING) private SpotStatus status = SpotStatus.AVAILABLE;
 
    private boolean isActive = true;
    private LocalDateTime updatedAt;
 
    @PreUpdate protected void onUpdate() { updatedAt = LocalDateTime.now(); }
 
    public enum SpotType { STANDARD, COMPACT, HANDICAP, EV_CHARGING, MOTORCYCLE, OVERSIZED }
    public enum SpotStatus { AVAILABLE, OCCUPIED, RESERVED, MAINTENANCE }
}
