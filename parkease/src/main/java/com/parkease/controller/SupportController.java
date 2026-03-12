package com.parkease.controller;
 
import com.parkease.dto.support.*;
import com.parkease.entity.User;
import com.parkease.service.SupportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
 
@RestController
@RequestMapping("/support")
@RequiredArgsConstructor
public class SupportController {
 
    private final SupportService supportService;
 
    @PostMapping("/tickets")
    public ResponseEntity<TicketDTO> submitTicket(
            @AuthenticationPrincipal(errorOnInvalidType = false) User user,
            @Valid @RequestBody CreateTicketRequest request) {
        return ResponseEntity.ok(supportService.createTicket(user, request));
    }
 
    @GetMapping("/tickets")
    public ResponseEntity<Page<TicketDTO>> getMyTickets(
            @AuthenticationPrincipal User user,
            Pageable pageable) {
        return ResponseEntity.ok(supportService.getUserTickets(user.getId(), pageable));
    }
 
    @GetMapping("/tickets/{id}")
    public ResponseEntity<TicketDTO> getTicket(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        return ResponseEntity.ok(supportService.getTicket(user.getId(), id));
    }
 
    @GetMapping("/faqs")
    public ResponseEntity<?> getFaqs(@RequestParam(required = false) String category) {
        return ResponseEntity.ok(supportService.getFaqs(category));
    }
}
 