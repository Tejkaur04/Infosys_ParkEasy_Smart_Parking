package com.parkease.dto.user;


import jakarta.validation.constraints.*;
import lombok.*;
 
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class UpdateProfileRequest {
 
    @Size(min = 2, max = 100)
    private String firstName;
 
    @Size(min = 2, max = 100)
    private String lastName;
 
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Invalid phone number")
    private String phone;
 
    private String profileImageUrl;
}
