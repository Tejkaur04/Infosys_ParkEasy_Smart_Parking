package com.parkease.dto.support;

import jakarta.validation.constraints.*;
import lombok.*;
 
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class CreateTicketRequest {
 
    @NotBlank(message = "Name is required")
    @Size(max = 200)
    private String name;
 
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
 
    @NotBlank(message = "Category is required")
    private String category; // BOOKING, PAYMENT, TECHNICAL, GENERAL, COMPLAINT, FEEDBACK
 
    @NotBlank(message = "Subject is required")
    @Size(max = 500)
    private String subject;
 
    @NotBlank(message = "Description is required")
    @Size(min = 20, message = "Description must be at least 20 characters")
    private String description;
 
    private Long bookingId; // optional, link to a booking
}
