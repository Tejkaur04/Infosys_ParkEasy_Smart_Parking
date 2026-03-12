package com.parkease.dto.booking;

import lombok.*;
 
@Data @NoArgsConstructor @AllArgsConstructor
public class CancelBookingRequest {
    private String reason;
}