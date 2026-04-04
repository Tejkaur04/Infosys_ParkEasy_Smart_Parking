package com.parkease.controller;

import com.parkease.entity.*;
import com.parkease.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/admin")
// @PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final ParkingLocationRepository locationRepository;
    private final ParkingSpotRepository spotRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers",     userRepository.count());
        stats.put("totalBookings",  bookingRepository.count());
        stats.put("totalLocations", locationRepository.count());
        stats.put("totalRevenue",   paymentRepository.sumAllRevenue());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<Page<Map<String, Object>>> getUsers(Pageable pageable) {
        return ResponseEntity.ok(userRepository.findAll(pageable).map(u -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id",        u.getId());
            m.put("email",     u.getEmail());
            m.put("firstName", u.getFirstName());
            m.put("lastName",  u.getLastName());
            m.put("role",      u.getRole().name());
            m.put("isActive",  u.isActive());
            m.put("createdAt", u.getCreatedAt());
            return m;
        }));
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<?> updateRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        var user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(User.Role.valueOf(body.get("role")));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Role updated"));
    }

    @PatchMapping("/users/{id}/toggle")
    public ResponseEntity<?> toggleUser(@PathVariable Long id) {
        var user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(!user.isActive());
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("active", user.isActive()));
    }

    @GetMapping("/bookings")
    public ResponseEntity<Page<Map<String, Object>>> getBookings(Pageable pageable) {
        return ResponseEntity.ok(bookingRepository.findAll(pageable).map(b -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id",               b.getId());
            m.put("bookingReference", b.getBookingReference());
            m.put("userName",         b.getUser().getFirstName() + " " + b.getUser().getLastName());
            m.put("userEmail",        b.getUser().getEmail());
            m.put("locationName", b.getSpot().getLocation().getName());
            m.put("spotNumber",   b.getSpot().getSpotNumber());
            m.put("startTime",        b.getStartTime());
            m.put("endTime",          b.getEndTime());
            m.put("totalAmount",      b.getTotalAmount());
            m.put("status",           b.getStatus().name());
            return m;
        }));
    }

    @GetMapping("/payments")
    public ResponseEntity<Page<Map<String, Object>>> getPayments(Pageable pageable) {
        return ResponseEntity.ok(paymentRepository.findAll(pageable).map(p -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id",               p.getId());
            m.put("paymentReference", p.getPaymentReference());
            m.put("amount",           p.getAmount());
            m.put("paymentMethod",    p.getPaymentMethod());
            m.put("paymentStatus",    p.getPaymentStatus());
            m.put("userEmail",        p.getUser().getEmail());
            m.put("createdAt",        p.getCreatedAt());
            return m;
        }));
    }

    @GetMapping("/locations")
    public ResponseEntity<Page<Map<String, Object>>> getLocations(Pageable pageable) {
        return ResponseEntity.ok(locationRepository.findAll(pageable).map(l -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id",             l.getId());
            m.put("name",           l.getName());
            m.put("city",           l.getCity());
            m.put("totalSpots",     l.getTotalSpots());
            m.put("availableSpots", l.getAvailableSpots());
            m.put("hourlyRate",     l.getHourlyRate());
            m.put("isActive",       l.isActive());
            return m;
        }));
    }
}