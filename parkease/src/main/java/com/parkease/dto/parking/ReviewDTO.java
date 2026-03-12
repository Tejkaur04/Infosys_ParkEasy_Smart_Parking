package com.parkease.dto.parking;

import lombok.*;
import java.time.LocalDateTime;
 
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ReviewDTO {
    private Long id;
    private String reviewerName;
    private int rating;
    private String title;
    private String comment;
    private LocalDateTime createdAt;
}
