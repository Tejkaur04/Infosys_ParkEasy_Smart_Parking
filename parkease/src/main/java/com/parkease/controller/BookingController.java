package com.parkease.controller;
 
import com.parkease.dto.booking.*;
import com.parkease.entity.User;
import com.parkease.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
 
@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {
 
    private final BookingService bookingService;
 
    @PostMapping
    public ResponseEntity<BookingDTO> createBooking(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateBookingRequest request) {
        return ResponseEntity.ok(bookingService.create(user, request));
    }
 
    @GetMapping
    public ResponseEntity<Page<BookingDTO>> getMyBookings(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String status,
            Pageable pageable) {
        return ResponseEntity.ok(bookingService.getUserBookings(user.getId(), status, pageable));
    }
 
    @GetMapping("/{id}")
    public ResponseEntity<BookingDTO> getBooking(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBooking(user.getId(), id));
    }
 
    @GetMapping("/reference/{ref}")
    public ResponseEntity<BookingDTO> getByReference(
            @AuthenticationPrincipal User user,
            @PathVariable String ref) {
        return ResponseEntity.ok(bookingService.getByReference(user.getId(), ref));
    }
 
    @PostMapping("/{id}/cancel")
    public ResponseEntity<BookingDTO> cancelBooking(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestBody CancelBookingRequest request) {
        return ResponseEntity.ok(bookingService.cancel(user.getId(), id, request.getReason()));
    }
 
    @GetMapping("/active")
    public ResponseEntity<BookingDTO> getActiveBooking(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.getActiveBooking(user.getId()));
    }
 
    @GetMapping("/stats")
    public ResponseEntity<BookingStatsDTO> getStats(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.getUserStats(user.getId()));
    }
}
 