package com.parkease.repository;

import com.parkease.entity.SupportTicket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 
import java.util.Optional;
 
@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
 
    Page<SupportTicket> findByUserId(Long userId, Pageable pageable);
 
    Optional<SupportTicket> findByIdAndUserId(Long id, Long userId);
 
    Optional<SupportTicket> findByTicketNumber(String ticketNumber);
 
    Page<SupportTicket> findByStatus(SupportTicket.TicketStatus status, Pageable pageable);
}
 