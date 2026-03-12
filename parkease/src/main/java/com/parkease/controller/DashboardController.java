package com.parkease.controller;
 
import com.parkease.dto.dashboard.*;
import com.parkease.entity.User;
import com.parkease.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
 
@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {
 
    private final DashboardService dashboardService;
 
    @GetMapping
    public ResponseEntity<DashboardDTO> getDashboard(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(dashboardService.getDashboard(user.getId()));
    }
 
    @GetMapping("/spending")
    public ResponseEntity<?> getSpendingChart(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "6") int months) {
        return ResponseEntity.ok(dashboardService.getSpendingData(user.getId(), months));
    }
 
    @GetMapping("/recent-bookings")
    public ResponseEntity<?> getRecentBookings(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(dashboardService.getRecentBookings(user.getId()));
    }
}
 