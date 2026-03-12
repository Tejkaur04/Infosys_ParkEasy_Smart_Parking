package com.parkease.dto.auth;
 
import lombok.*;
 
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class AuthResponse {
    private String token;
    private String refreshToken;
    private UserDTO user;
}