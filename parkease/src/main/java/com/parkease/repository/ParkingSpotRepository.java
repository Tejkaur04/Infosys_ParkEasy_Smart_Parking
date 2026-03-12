package com.parkease.repository;

import com.parkease.entity.ParkingSpot;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
 
import java.util.List;
import java.util.Optional;
 
@Repository
public interface ParkingSpotRepository extends JpaRepository<ParkingSpot, Long> {
 
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM ParkingSpot s WHERE s.id = :id")
    Optional<ParkingSpot> findByIdWithLock(@Param("id") Long id);
 
    @Query("""
        SELECT s FROM ParkingSpot s
        WHERE s.location.id = :locationId
          AND s.isActive = true
          AND (:floor IS NULL OR s.floorLevel = :floor)
        ORDER BY s.floorLevel, s.spotNumber
        """)
    List<ParkingSpot> findByLocationId(@Param("locationId") Long locationId,
                                       @Param("floor") Integer floor);
 
    @Query("""
        SELECT s FROM ParkingSpot s
        WHERE s.location.id = :locationId
          AND s.status = :status
          AND s.isActive = true
          AND (:floor IS NULL OR s.floorLevel = :floor)
        ORDER BY s.floorLevel, s.spotNumber
        """)
    List<ParkingSpot> findByLocationIdAndStatus(@Param("locationId") Long locationId,
                                                @Param("status") ParkingSpot.SpotStatus status,
                                                @Param("floor") Integer floor);
 
    @Query("SELECT COUNT(s) FROM ParkingSpot s WHERE s.location.id = :locationId AND s.status = 'AVAILABLE'")
    int countAvailableByLocationId(@Param("locationId") Long locationId);
}
 
