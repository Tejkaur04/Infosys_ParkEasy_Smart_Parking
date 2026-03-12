package com.parkease.service;
 
import com.parkease.dto.payment.*;
import com.parkease.entity.*;
import com.parkease.exception.*;
import com.parkease.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
 
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
 
@Service
@RequiredArgsConstructor
public class PaymentService {
 
    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;
 
    @Transactional
    public PaymentResponse process(User user, PaymentRequest request) {
        var booking = bookingRepository.findByIdAndUserId(request.getBookingId(), user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
 
        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new IllegalStateException("Cannot pay for cancelled booking");
        }
 
        // Check if already paid
        if (paymentRepository.existsByBookingId(booking.getId())) {
            throw new IllegalStateException("Booking already paid");
        }
 
        // Here you'd integrate with a real payment gateway (Stripe, PayPal, etc.)
        // For now, simulate payment processing
        boolean paymentSuccess = processWithGateway(request);
 
        var payment = Payment.builder()
            .paymentReference("PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
            .booking(booking)
            .user(user)
            .amount(booking.getTotalAmount())
            .currency("USD")
            .paymentMethod(Payment.PaymentMethod.valueOf(request.getPaymentMethod()))
            .paymentStatus(paymentSuccess ? Payment.PaymentStatus.COMPLETED : Payment.PaymentStatus.FAILED)
            .transactionId(UUID.randomUUID().toString())
            .cardLastFour(request.getCardLastFour())
            .cardBrand(request.getCardBrand())
            .paidAt(paymentSuccess ? LocalDateTime.now() : null)
            .build();
 
        payment = paymentRepository.save(payment);
 
        if (paymentSuccess) {
            booking.setStatus(Booking.BookingStatus.CONFIRMED);
            bookingRepository.save(booking);
            notificationService.send(user.getId(), "Payment Confirmed",
                "Payment of $" + booking.getTotalAmount() + " received for booking " + booking.getBookingReference(), "PAYMENT");
        }
 
        return PaymentResponse.builder()
            .success(paymentSuccess)
            .paymentReference(payment.getPaymentReference())
            .transactionId(payment.getTransactionId())
            .message(paymentSuccess ? "Payment processed successfully" : "Payment failed")
            .build();
    }
 
    private boolean processWithGateway(PaymentRequest request) {
        // Integrate with Stripe, PayPal, etc.
        // Simulate: deny test cards ending in 0000
        return request.getCardLastFour() == null || !request.getCardLastFour().equals("0000");
    }
 
    public Page<PaymentDTO> getUserPayments(Long userId, Pageable pageable) {
        return paymentRepository.findByUserId(userId, pageable).map(this::mapToDTO);
    }
 
    public PaymentDTO getPayment(Long userId, Long paymentId) {
        return paymentRepository.findByIdAndUserId(paymentId, userId)
            .map(this::mapToDTO)
            .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
    }
 
    @Transactional
    public PaymentDTO refund(Long userId, Long paymentId, RefundRequest request) {
        var payment = paymentRepository.findByIdAndUserId(paymentId, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
 
        if (payment.getPaymentStatus() != Payment.PaymentStatus.COMPLETED) {
            throw new IllegalStateException("Only completed payments can be refunded");
        }
 
        BigDecimal refundAmount = request.getAmount() != null ? request.getAmount() : payment.getAmount();
 
        // Process refund with gateway...
        payment.setPaymentStatus(Payment.PaymentStatus.REFUNDED);
        payment.setRefundAmount(refundAmount);
        paymentRepository.save(payment);
 
        return mapToDTO(payment);
    }
 
    public PaymentDTO getByBookingId(Long userId, Long bookingId) {
        return paymentRepository.findByBookingIdAndUserId(bookingId, userId)
            .map(this::mapToDTO)
            .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
    }
 
    private PaymentDTO mapToDTO(Payment p) {
        return PaymentDTO.builder()
            .id(p.getId())
            .paymentReference(p.getPaymentReference())
            .amount(p.getAmount())
            .currency(p.getCurrency())
            .paymentMethod(p.getPaymentMethod().name())
            .paymentStatus(p.getPaymentStatus().name())
            .transactionId(p.getTransactionId())
            .cardLastFour(p.getCardLastFour())
            .cardBrand(p.getCardBrand())
            .paidAt(p.getPaidAt())
            .createdAt(p.getCreatedAt())
            .build();
    }
}
 