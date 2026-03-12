package com.parkease.service;

import com.parkease.entity.Notification;
import com.parkease.entity.User;
import com.parkease.repository.NotificationRepository;
import com.parkease.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
 
@Service
@RequiredArgsConstructor
public class NotificationService {
 
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
 
    @Transactional
    public void send(Long userId, String title, String message, String type) {
        var user = userRepository.findById(userId).orElse(null);
        if (user == null) return;
 
        var notification = Notification.builder()
            .user(user)
            .title(title)
            .message(message)
            .type(Notification.NotificationType.valueOf(type))
            .isRead(false)
            .build();
 
        notificationRepository.save(notification);
    }
}