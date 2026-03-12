package com.parkease.dto.user;

 
import lombok.*;
import java.time.LocalDateTime;
 
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class UserDTO {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String role;
    private String profileImageUrl;
    private boolean isVerified;
    private LocalDateTime createdAt;
}