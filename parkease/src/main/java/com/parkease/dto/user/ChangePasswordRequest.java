package com.parkease.dto.user;

import jakarta.validation.constraints.*;
import lombok.*;
 
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ChangePasswordRequest {
 
    @NotBlank(message = "Current password is required")
    private String currentPassword;
 
    @NotBlank(message = "New password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[0-9]).+$",
             message = "Password must contain an uppercase letter and digit")
    private String newPassword;
 
    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;
}