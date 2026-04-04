package com.parkease.dto.auth;
 
import lombok.*;
 
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class UserDTO {

    public static Object builder() {
        throw new UnsupportedOperationException("Not supported yet.");
    }
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String role;
    private String profileImageUrl;
    private boolean isVerified;
}