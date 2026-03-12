package com.parkease.repository;

import com.parkease.dto.parking.ParkingSearchFilter;
import com.parkease.entity.ParkingLocation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
 
import java.util.List;
 
@Repository
public interface ParkingLocationRepository extends JpaRepository<ParkingLocation, Long> {
 
    @Query("""
        SELECT l FROM ParkingLocation l
        WHERE l.isActive = true
          AND (:#{#f.city} IS NULL OR LOWER(l.city) = LOWER(:#{#f.city}))
          AND (:#{#f.query} IS NULL
               OR LOWER(l.name) LIKE LOWER(CONCAT('%', :#{#f.query}, '%'))
               OR LOWER(l.address) LIKE LOWER(CONCAT('%', :#{#f.query}, '%')))
          AND (:#{#f.hasEvCharging} IS NULL OR l.hasEvCharging = :#{#f.hasEvCharging})
          AND (:#{#f.isCovered}     IS NULL OR l.isCovered     = :#{#f.isCovered})
          AND (:#{#f.hasSecurity}   IS NULL OR l.hasSecurity   = :#{#f.hasSecurity})
          AND (:#{#f.is24Hours}     IS NULL OR l.is24Hours     = :#{#f.is24Hours})
          AND (:#{#f.maxRate}       IS NULL OR l.hourlyRate   <= :#{#f.maxRate})
        """)
    Page<ParkingLocation> search(@Param("f") ParkingSearchFilter filter, Pageable pageable);
 
    @Query("""
        SELECT l FROM ParkingLocation l
        WHERE l.isActive = true
          AND (6371 * acos(
                cos(radians(:lat)) * cos(radians(l.latitude)) *
                cos(radians(l.longitude) - radians(:lng)) +
                sin(radians(:lat)) * sin(radians(l.latitude))
               )) <= :radiusKm
        ORDER BY (6371 * acos(
                cos(radians(:lat)) * cos(radians(l.latitude)) *
                cos(radians(l.longitude) - radians(:lng)) +
                sin(radians(:lat)) * sin(radians(l.latitude))
               )) ASC
        """)
    List<ParkingLocation> findNearby(@Param("lat") double lat,
                                     @Param("lng") double lng,
                                     @Param("radiusKm") double radiusKm);
}