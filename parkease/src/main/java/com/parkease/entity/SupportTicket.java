package com.parkease.entity;
 
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
 
@Entity @Table(name = "support_tickets")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class SupportTicket {
 
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    @Column(name = "ticket_number", unique = true, nullable = false)
    private String ticketNumber;
 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
 
    @Column(nullable = false) private String name;
    @Column(nullable = false) private String email;
 
    @Enumerated(EnumType.STRING) private TicketCategory category;
    @Column(nullable = false) private String subject;
    @Column(nullable = false) private String description;
 
    @Enumerated(EnumType.STRING) private TicketStatus status = TicketStatus.OPEN;
    @Enumerated(EnumType.STRING) private TicketPriority priority = TicketPriority.MEDIUM;
 
    private LocalDateTime resolvedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
 
    @PrePersist protected void onCreate() { createdAt = updatedAt = LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { updatedAt = LocalDateTime.now(); }
 
    public enum TicketCategory { BOOKING, PAYMENT, TECHNICAL, GENERAL, COMPLAINT, FEEDBACK }
    public enum TicketStatus { OPEN, IN_PROGRESS, RESOLVED, CLOSED }
    public enum TicketPriority { LOW, MEDIUM, HIGH, URGENT }
}
 
