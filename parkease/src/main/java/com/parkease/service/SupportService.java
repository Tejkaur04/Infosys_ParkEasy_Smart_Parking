package com.parkease.service;
 
import com.parkease.dto.support.*;
import com.parkease.entity.*;
import com.parkease.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
 
import java.util.*;
 
@Service
@RequiredArgsConstructor
public class SupportService {
 
    private final SupportTicketRepository ticketRepository;
 
    public TicketDTO createTicket(User user, CreateTicketRequest request) {
        var ticket = SupportTicket.builder()
            .ticketNumber("SPT-" + String.format("%06d", (int)(Math.random()*1000000)))
            .user(user)
            .name(request.getName()).email(request.getEmail())
            .category(SupportTicket.TicketCategory.valueOf(request.getCategory()))
            .subject(request.getSubject()).description(request.getDescription())
            .status(SupportTicket.TicketStatus.OPEN)
            .priority(SupportTicket.TicketPriority.MEDIUM)
            .build();
 
        ticket = ticketRepository.save(ticket);
        return mapToDTO(ticket);
    }
 
    public Page<TicketDTO> getUserTickets(Long userId, Pageable pageable) {
        return ticketRepository.findByUserId(userId, pageable).map(this::mapToDTO);
    }
 
    public TicketDTO getTicket(Long userId, Long ticketId) {
        return ticketRepository.findByIdAndUserId(ticketId, userId)
            .map(this::mapToDTO)
            .orElseThrow(() -> new com.parkease.exception.ResourceNotFoundException("Ticket not found"));
    }
 
    public List<Map<String, Object>> getFaqs(String category) {
        // In production, fetch from DB; here returning static data
        return List.of(
            Map.of("id", 1, "question", "How do I cancel a booking?", "answer", "Go to Dashboard > Bookings and click Cancel.", "category", "BOOKING"),
            Map.of("id", 2, "question", "When will I get my refund?", "answer", "Refunds are processed within 3-5 business days.", "category", "PAYMENT")
        );
    }
 
    private TicketDTO mapToDTO(SupportTicket t) {
        return TicketDTO.builder()
            .id(t.getId()).ticketNumber(t.getTicketNumber())
            .subject(t.getSubject()).category(t.getCategory().name())
            .status(t.getStatus().name()).priority(t.getPriority().name())
            .createdAt(t.getCreatedAt()).build();
    }
}
