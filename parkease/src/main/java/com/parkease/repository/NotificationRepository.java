package com.parkease.repository;

import com.parkease.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
 
import java.util.List;
 
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
 
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
 
    List<Notification> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(Long userId);
 
    Page<Notification> findByUserId(Long userId, Pageable pageable);
 
    long countByUserIdAndIsReadFalse(Long userId);
 
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.user.id = :userId AND n.id = :id")
    void markAsRead(@Param("userId") Long userId, @Param("id") Long id);
 
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.user.id = :userId")
    void markAllAsRead(@Param("userId") Long userId);
}