package com.parkease.dto.dashboard;

import com.parkease.dto.booking.BookingDTO;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;
 
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class DashboardDTO {
    // Summary stats
    private long totalBookings;
    private long activeBookings;
    private long completedBookings;
    private BigDecimal totalSpent;
    private BigDecimal totalHoursParked;
 
    // Active booking (if any)
    private BookingDTO activeBooking;
 
    // Recent bookings (last 5)
    private List<BookingDTO> recentBookings;
 
    // Upcoming bookings
    private List<BookingDTO> upcomingBookings;
 
    // Unread notifications count
    private int unreadNotifications;
 
    // Spending this month
    private BigDecimal spentThisMonth;
 
    // Favorite location
    private String favoriteLocation;
}
 