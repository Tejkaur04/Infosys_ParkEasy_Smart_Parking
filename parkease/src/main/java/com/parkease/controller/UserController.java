package com.parkease.controller;
 
import com.parkease.dto.payment.*;
import com.parkease.entity.User;
import com.parkease.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
 
@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {
 
    private final PaymentService paymentService;
 
    @PostMapping("/process")
    public ResponseEntity<PaymentResponse> processPayment(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody PaymentRequest request) {
        return ResponseEntity.ok(paymentService.process(user, request));
    }
 
    @GetMapping
    public ResponseEntity<Page<PaymentDTO>> getMyPayments(
            @AuthenticationPrincipal User user,
            Pageable pageable) {
        return ResponseEntity.ok(paymentService.getUserPayments(user.getId(), pageable));
    }
 
    @GetMapping("/{id}")
    public ResponseEntity<PaymentDTO> getPayment(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getPayment(user.getId(), id));
    }
 
    @PostMapping("/{id}/refund")
    public ResponseEntity<PaymentDTO> refundPayment(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestBody RefundRequest request) {
        return ResponseEntity.ok(paymentService.refund(user.getId(), id, request));
    }
 
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<PaymentDTO> getByBooking(
            @AuthenticationPrincipal User user,
            @PathVariable Long bookingId) {
        return ResponseEntity.ok(paymentService.getByBookingId(user.getId(), bookingId));
    }
}
 