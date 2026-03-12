package com.parkease.service;
 
import com.parkease.dto.booking.*;
import com.parkease.entity.*;
import com.parkease.exception.*;
import com.parkease.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
 
import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.UUID;
 
@Service
@RequiredArgsConstructor
public class BookingService {
 
    private final BookingRepository bookingRepository;
    private final ParkingSpotRepository spotRepository;
    private final VehicleRepository vehicleRepository;
    private final NotificationService notificationService;
 
    @Transactional
    public BookingDTO create(User user, CreateBookingRequest request) {
        var spot = spotRepository.findByIdWithLock(request.getSpotId())
            .orElseThrow(() -> new ResourceNotFoundException("Spot not found"));
 
        if (spot.getStatus() != ParkingSpot.SpotStatus.AVAILABLE) {
            throw new SpotUnavailableException("Spot " + spot.getSpotNumber() + " is not available");
        }
 
        // Check for time conflicts
        boolean hasConflict = bookingRepository.existsConflictingBooking(
            request.getSpotId(), request.getStartTime(), request.getEndTime()
        );
        if (hasConflict) {
            throw new SpotUnavailableException("Spot already booked for the requested time");
        }
 
        BigDecimal durationHours = BigDecimal.valueOf(
            Duration.between(request.getStartTime(), request.getEndTime()).toMinutes() / 60.0
        );
        BigDecimal totalAmount = durationHours.multiply(spot.getLocation().getHourlyRate());
 
        Vehicle vehicle = null;
        if (request.getVehicleId() != null) {
            vehicle = vehicleRepository.findByIdAndUserId(request.getVehicleId(), user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
        }
 
        var booking = Booking.builder()
            .bookingReference(generateBookingRef())
            .user(user)
            .spot(spot)
            .vehicle(vehicle)
            .startTime(request.getStartTime())
            .endTime(request.getEndTime())
            .totalAmount(totalAmount)
            .durationHours(durationHours)
            .status(Booking.BookingStatus.CONFIRMED)
            .notes(request.getNotes())
            .build();
 
        spot.setStatus(ParkingSpot.SpotStatus.RESERVED);
        spotRepository.save(spot);
 
        booking = bookingRepository.save(booking);
 
        notificationService.send(user.getId(), "Booking Confirmed",
            "Your spot " + spot.getSpotNumber() + " is reserved for " + request.getStartTime(), "BOOKING");
 
        return mapToDTO(booking);
    }
 
    public Page<BookingDTO> getUserBookings(Long userId, String status, Pageable pageable) {
        if (status != null) {
            var statusEnum = Booking.BookingStatus.valueOf(status.toUpperCase());
            return bookingRepository.findByUserIdAndStatus(userId, statusEnum, pageable).map(this::mapToDTO);
        }
        return bookingRepository.findByUserId(userId, pageable).map(this::mapToDTO);
    }
 
    public BookingDTO getBooking(Long userId, Long bookingId) {
        return bookingRepository.findByIdAndUserId(bookingId, userId)
            .map(this::mapToDTO)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
    }
 
    public BookingDTO getByReference(Long userId, String ref) {
        return bookingRepository.findByBookingReferenceAndUserId(ref, userId)
            .map(this::mapToDTO)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
    }
 
    @Transactional
    public BookingDTO cancel(Long userId, Long bookingId, String reason) {
        var booking = bookingRepository.findByIdAndUserId(bookingId, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
 
        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new IllegalStateException("Booking already cancelled");
        }
        if (booking.getStatus() == Booking.BookingStatus.COMPLETED) {
            throw new IllegalStateException("Cannot cancel completed booking");
        }
 
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        booking.setCancelledAt(LocalDateTime.now());
        booking.setCancellationReason(reason);
 
        // Free up the spot
        var spot = booking.getSpot();
        spot.setStatus(ParkingSpot.SpotStatus.AVAILABLE);
        spotRepository.save(spot);
 
        bookingRepository.save(booking);
        return mapToDTO(booking);
    }
 
    public BookingDTO getActiveBooking(Long userId) {
        return bookingRepository.findActiveByUserId(userId)
            .map(this::mapToDTO)
            .orElse(null);
    }
 
    public BookingStatsDTO getUserStats(Long userId) {
        long total = bookingRepository.countByUserId(userId);
        long completed = bookingRepository.countByUserIdAndStatus(userId, Booking.BookingStatus.COMPLETED);
        BigDecimal totalSpent = bookingRepository.sumAmountByUserId(userId);
        return BookingStatsDTO.builder()
            .totalBookings(total).completedBookings(completed)
            .totalSpent(totalSpent != null ? totalSpent : BigDecimal.ZERO).build();
    }
 
    private String generateBookingRef() {
        return "PW-" + java.time.Year.now().getValue() + "-" +
               String.format("%06d", (int)(Math.random() * 1000000));
    }
 
    private BookingDTO mapToDTO(Booking b) {
        return BookingDTO.builder()
            .id(b.getId())
            .bookingReference(b.getBookingReference())
            .spotNumber(b.getSpot().getSpotNumber())
            .locationName(b.getSpot().getLocation().getName())
            .startTime(b.getStartTime())
            .endTime(b.getEndTime())
            .status(b.getStatus().name())
            .totalAmount(b.getTotalAmount())
            .durationHours(b.getDurationHours())
            .createdAt(b.getCreatedAt())
            .build();
    }
}
 
 