import com.parkease.dto.user.*;
import com.parkease.entity.*;
import com.parkease.exception.ResourceNotFoundException;
import com.parkease.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
 
import java.util.List;
import java.util.stream.Collectors;
 
@Service
@RequiredArgsConstructor
public class UserService {
 
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;
 
    public UserDTO getProfile(Long userId) {
        return userRepository.findById(userId)
            .map(this::mapToDTO)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
 
    @Transactional
    public UserDTO updateProfile(Long userId, UpdateProfileRequest request) {
        var user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
 
        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getProfileImageUrl() != null) user.setProfileImageUrl(request.getProfileImageUrl());
 
        return mapToDTO(userRepository.save(user));
    }
 
    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }
        var user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
 
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
 
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
 
    public List<VehicleDTO> getVehicles(Long userId) {
        return vehicleRepository.findByUserId(userId).stream()
            .map(this::mapVehicleToDTO).collect(Collectors.toList());
    }
 
    @Transactional
    public VehicleDTO addVehicle(Long userId, AddVehicleRequest request) {
        var user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
 
        if (request.isDefault()) {
            vehicleRepository.findByUserIdAndIsDefaultTrue(userId)
                .ifPresent(v -> { v.setDefault(false); vehicleRepository.save(v); });
        }
 
        var vehicle = Vehicle.builder()
            .user(user)
            .licensePlate(request.getLicensePlate().toUpperCase())
            .make(request.getMake())
            .model(request.getModel())
            .color(request.getColor())
            .vehicleType(request.getVehicleType() != null
                ? Vehicle.VehicleType.valueOf(request.getVehicleType())
                : Vehicle.VehicleType.SEDAN)
            .isDefault(request.isDefault())
            .build();
 
        return mapVehicleToDTO(vehicleRepository.save(vehicle));
    }
 
    @Transactional
    public void deleteVehicle(Long userId, Long vehicleId) {
        var vehicle = vehicleRepository.findByIdAndUserId(vehicleId, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
        vehicleRepository.delete(vehicle);
    }
 
    public List<NotificationDTO> getNotifications(Long userId, boolean unreadOnly) {
        var notifications = unreadOnly
            ? notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId)
            : notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
 
        return notifications.stream().map(n -> NotificationDTO.builder()
            .id(n.getId()).title(n.getTitle()).message(n.getMessage())
            .type(n.getType().name()).isRead(n.isRead())
            .createdAt(n.getCreatedAt()).build()
        ).collect(Collectors.toList());
    }
 
    @Transactional
    public void markNotificationRead(Long userId, Long notificationId) {
        notificationRepository.markAsRead(userId, notificationId);
    }
 
    private UserDTO mapToDTO(User u) {
        return UserDTO.builder()
            .id(u.getId()).email(u.getEmail())
            .firstName(u.getFirstName()).lastName(u.getLastName())
            .phone(u.getPhone()).role(u.getRole().name())
            .profileImageUrl(u.getProfileImageUrl())
            .isVerified(u.isVerified()).createdAt(u.getCreatedAt())
            .build();
    }
 
    private VehicleDTO mapVehicleToDTO(Vehicle v) {
        return VehicleDTO.builder()
            .id(v.getId()).licensePlate(v.getLicensePlate())
            .make(v.getMake()).model(v.getModel()).color(v.getColor())
            .vehicleType(v.getVehicleType().name())
            .isDefault(v.isDefault()).createdAt(v.getCreatedAt())
            .build();
    }
}
 
 