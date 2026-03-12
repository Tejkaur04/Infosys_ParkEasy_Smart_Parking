package com.parkease.dto.auth;
 
import jakarta.validation.constraints.*;
import lombok.*;
 
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ResetPasswordRequest {
 
    @NotBlank(message = "Token is required")
    private String token;
 
    @NotBlank(message = "New password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[0-9]).+$",
             message = "Password must contain at least one uppercase letter and one digit")
    private String newPassword;
}