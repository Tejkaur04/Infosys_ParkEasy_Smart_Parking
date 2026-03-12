package com.parkease.dto.support;

import lombok.*;
import java.time.LocalDateTime;
 
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class TicketDTO {
    private Long id;
    private String ticketNumber;
    private String name;
    private String email;
    private String category;
    private String subject;
    private String description;
    private String status;
    private String priority;
    private LocalDateTime resolvedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}