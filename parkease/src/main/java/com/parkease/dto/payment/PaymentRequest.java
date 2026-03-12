package com.parkease.dto.payment;

import jakarta.validation.constraints.*;
import lombok.*;
 
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class PaymentRequest {
 
    @NotNull(message = "Booking ID is required")
    private Long bookingId;
 
    @NotBlank(message = "Payment method is required")
    private String paymentMethod; // CREDIT_CARD, DEBIT_CARD, PAYPAL, WALLET, UPI
 
    // Card details (required when method is CREDIT_CARD or DEBIT_CARD)
    private String cardToken;       // tokenized card from frontend (e.g., Stripe token)
    private String cardLastFour;
    private String cardBrand;       // VISA, MASTERCARD, AMEX
 
    // PayPal
    private String paypalOrderId;
 
    // Wallet
    private String walletType;      // APPLE_PAY, GOOGLE_PAY, PARKWISE_WALLET
 
    private String currency = "USD";
}