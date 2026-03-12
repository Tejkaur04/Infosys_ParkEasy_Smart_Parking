package com.parkease.dto.auth;
 
import jakarta.validation.constraints.*;
import lombok.*;
 
@Data @NoArgsConstructor @AllArgsConstructor
public class ForgotPasswordRequest {
 
    @NotBlank @Email
    private String email;
}
