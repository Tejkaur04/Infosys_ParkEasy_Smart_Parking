package com.parkease.dto.auth;
 
import jakarta.validation.constraints.*;
import lombok.*;
 
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class RegisterRequest {
 
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 100)
    private String firstName;
 
    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 100)
    private String lastName;
 
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
 
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[0-9]).+$",
             message = "Password must contain at least one uppercase letter and one digit")
    private String password;
 
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Invalid phone number")
    private String phone;
}
 
