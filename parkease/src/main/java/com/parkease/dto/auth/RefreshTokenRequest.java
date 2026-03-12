package com.parkease.dto.auth;
 
import lombok.*;
 
@Data @NoArgsConstructor @AllArgsConstructor
public class RefreshTokenRequest {
    private String refreshToken;
}
