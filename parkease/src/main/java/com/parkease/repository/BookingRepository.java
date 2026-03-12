package com.parkease.repository;

import com.parkease.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
 
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
 
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
 
    Page<Booking> findByUserId(Long userId, Pageable pageable);
 
    Page<Booking> findByUserIdAndStatus(Long userId, Booking.BookingStatus status, Pageable pageable);
 
    Optional<Booking> findByIdAndUserId(Long id, Long userId);
 
    Optional<Booking> findByBookingReferenceAndUserId(String ref, Long userId);
 
    @Query("""
        SELECT b FROM Booking b
        WHERE b.user.id = :userId
          AND b.status IN ('ACTIVE', 'CONFIRMED')
          AND b.startTime <= CURRENT_TIMESTAMP
          AND b.endTime >= CURRENT_TIMESTAMP
        ORDER BY b.startTime DESC
        """)
    Optional<Booking> findActiveByUserId(@Param("userId") Long userId);
 
    @Query("""
        SELECT CASE WHEN COUNT(b) > 0 THEN TRUE ELSE FALSE END
        FROM Booking b
        WHERE b.spot.id = :spotId
          AND b.status NOT IN ('CANCELLED', 'NO_SHOW')
          AND b.startTime < :endTime
          AND b.endTime > :startTime
        """)
    boolean existsConflictingBooking(@Param("spotId") Long spotId,
                                     @Param("startTime") LocalDateTime startTime,
                                     @Param("endTime") LocalDateTime endTime);
 
    long countByUserId(Long userId);
 
    long countByUserIdAndStatus(Long userId, Booking.BookingStatus status);
 
    @Query("SELECT SUM(b.totalAmount) FROM Booking b WHERE b.user.id = :userId AND b.status = 'COMPLETED'")
    BigDecimal sumAmountByUserId(@Param("userId") Long userId);
 
    @Query("""
        SELECT b FROM Booking b
        WHERE b.user.id = :userId
        ORDER BY b.createdAt DESC
        """)
    Page<Booking> findRecentByUserId(@Param("userId") Long userId, Pageable pageable);
}