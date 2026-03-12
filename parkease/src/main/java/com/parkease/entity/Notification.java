package com.parkease.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
 
@Entity
@Table(name = "notifications")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Notification {
 
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
 
    @Column(nullable = false)
    private String title;
 
    @Column(nullable = false)
    private String message;
 
    @Enumerated(EnumType.STRING)
    private NotificationType type = NotificationType.SYSTEM;
 
    @Column(name = "is_read")
    private boolean isRead = false;
 
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
 
    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }
 
    public enum NotificationType { BOOKING, PAYMENT, REMINDER, PROMO, SYSTEM }
}
 
