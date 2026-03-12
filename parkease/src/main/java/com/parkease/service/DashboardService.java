package com.parkease.service;

import com.parkease.dto.dashboard.*;
import com.parkease.dto.booking.BookingDTO;
import com.parkease.entity.Booking;
import com.parkease.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
 
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;
 
@Service
@RequiredArgsConstructor
public class DashboardService {
 
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final NotificationRepository notificationRepository;
 
    public DashboardDTO getDashboard(Long userId) {
        long total = bookingRepository.countByUserId(userId);
        long completed = bookingRepository.countByUserIdAndStatus(userId, Booking.BookingStatus.COMPLETED);
        long active = bookingRepository.countByUserIdAndStatus(userId, Booking.BookingStatus.ACTIVE);
        BigDecimal totalSpent = bookingRepository.sumAmountByUserId(userId);
        long unread = notificationRepository.countByUserIdAndIsReadFalse(userId);
 
        var activeBooking = bookingRepository.findActiveByUserId(userId)
            .map(this::mapBookingToDTO).orElse(null);
 
        var recentBookings = bookingRepository
            .findRecentByUserId(userId, PageRequest.of(0, 5))
            .stream().map(this::mapBookingToDTO).collect(Collectors.toList());
 
        return DashboardDTO.builder()
            .totalBookings(total)
            .completedBookings(completed)
            .activeBookings(active)
            .totalSpent(totalSpent != null ? totalSpent : BigDecimal.ZERO)
            .activeBooking(activeBooking)
            .recentBookings(recentBookings)
            .unreadNotifications((int) unread)
            .build();
    }
 
    public List<SpendingDataPoint> getSpendingData(Long userId, int months) {
        // Query spending grouped by month for the last N months
        // Simplified — in production use a native query with GROUP BY
        return List.of(
            new SpendingDataPoint("Jul 2024", BigDecimal.valueOf(45.00), 3),
            new SpendingDataPoint("Aug 2024", BigDecimal.valueOf(80.00), 5),
            new SpendingDataPoint("Sep 2024", BigDecimal.valueOf(60.00), 4),
            new SpendingDataPoint("Oct 2024", BigDecimal.valueOf(110.00), 7),
            new SpendingDataPoint("Nov 2024", BigDecimal.valueOf(92.00), 6),
            new SpendingDataPoint("Dec 2024", BigDecimal.valueOf(100.00), 5)
        );
    }
 
    public List<BookingDTO> getRecentBookings(Long userId) {
        return bookingRepository
            .findRecentByUserId(userId, PageRequest.of(0, 10))
            .stream().map(this::mapBookingToDTO).collect(Collectors.toList());
    }
 
    private BookingDTO mapBookingToDTO(Booking b) {
        return BookingDTO.builder()
            .id(b.getId())
            .bookingReference(b.getBookingReference())
            .spotNumber(b.getSpot().getSpotNumber())
            .locationName(b.getSpot().getLocation().getName())
            .locationAddress(b.getSpot().getLocation().getAddress())
            .startTime(b.getStartTime())
            .endTime(b.getEndTime())
            .status(b.getStatus().name())
            .totalAmount(b.getTotalAmount())
            .durationHours(b.getDurationHours())
            .createdAt(b.getCreatedAt())
            .build();
    }
}
 