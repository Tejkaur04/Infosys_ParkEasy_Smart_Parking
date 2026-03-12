package com.parkease.entity;
 
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
 
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
 
@Entity @Table(name = "users")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class User implements UserDetails {
 
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    @Column(nullable = false, unique = true)
    private String email;
 
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;
 
    @Column(name = "first_name", nullable = false)
    private String firstName;
 
    @Column(name = "last_name", nullable = false)
    private String lastName;
 
    private String phone;
 
    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;
 
    @Column(name = "profile_image_url")
    private String profileImageUrl;
 
    @Column(name = "is_active")
    private boolean isActive = true;
 
    @Column(name = "is_verified")
    private boolean isVerified = false;
 
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
 
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
 
    @PrePersist
    protected void onCreate() { createdAt = updatedAt = LocalDateTime.now(); }
 
    @PreUpdate
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }
 
    public enum Role { USER, ADMIN, OPERATOR }
 
    @Override public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }
    @Override public String getPassword() { return passwordHash; }
    @Override public String getUsername() { return email; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return isActive; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return isActive; }
}
 
 