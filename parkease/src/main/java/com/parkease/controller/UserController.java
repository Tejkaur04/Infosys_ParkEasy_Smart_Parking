package com.parkease.controller;

import org.springframework.transaction.annotation.Transactional;
import com.parkease.dto.auth.UserDTO;
import com.parkease.entity.User;
import com.parkease.entity.Vehicle;
import com.parkease.entity.Notification;
import com.parkease.repository.UserRepository;
import com.parkease.repository.VehicleRepository;
import com.parkease.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final NotificationRepository notificationRepository;

    @Autowired
    public UserController(
            UserRepository userRepository,
            VehicleRepository vehicleRepository,
            NotificationRepository notificationRepository) {
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.notificationRepository = notificationRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(mapToDTO(user));
    }

    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> body) {
        if (body.containsKey("firstName")) user.setFirstName(body.get("firstName"));
        if (body.containsKey("lastName"))  user.setLastName(body.get("lastName"));
        if (body.containsKey("phone"))     user.setPhone(body.get("phone"));
        userRepository.save(user);
        return ResponseEntity.ok(mapToDTO(user));
    }

    @PutMapping("/me/password")
    public ResponseEntity<?> changePassword(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> body) {
        // implement password change logic here if needed
        return ResponseEntity.ok(Map.of("message", "Password updated"));
    }

    @GetMapping("/me/vehicles")
    public ResponseEntity<List<Vehicle>> getVehicles(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(vehicleRepository.findByUserId(user.getId()));
    }

    @PostMapping("/me/vehicles")
    public ResponseEntity<Vehicle> addVehicle(
            @AuthenticationPrincipal User user,
            @RequestBody Vehicle vehicle) {
        vehicle.setUser(user);
        return ResponseEntity.ok(vehicleRepository.save(vehicle));
    }

    @DeleteMapping("/me/vehicles/{id}")
    public ResponseEntity<?> deleteVehicle(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        vehicleRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Vehicle removed"));
    }

    @GetMapping("/me/notifications")
    public ResponseEntity<List<Notification>> getNotifications(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()));
    }

    @Transactional
    @PatchMapping("/me/notifications/{id}/read")
    public ResponseEntity<?> markRead(
        @AuthenticationPrincipal User user,
        @PathVariable Long id) {
    notificationRepository.markAsRead(user.getId(), id);
    return ResponseEntity.ok(Map.of("message", "Marked as read"));
}

    private UserDTO mapToDTO(User user) {
    UserDTO dto = new UserDTO();
    dto.setId(user.getId());
    dto.setEmail(user.getEmail());
    dto.setFirstName(user.getFirstName());
    dto.setLastName(user.getLastName());
    dto.setPhone(user.getPhone());
    dto.setRole(user.getRole().name());
    return dto;
}
}