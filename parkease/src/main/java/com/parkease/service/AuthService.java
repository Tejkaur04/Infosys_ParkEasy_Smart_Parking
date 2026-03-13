package com.parkease.service;
 
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.parkease.dto.auth.AuthResponse;
import com.parkease.dto.auth.LoginRequest;
import com.parkease.dto.auth.RefreshTokenRequest;
import com.parkease.dto.auth.RegisterRequest;
import com.parkease.dto.auth.ResetPasswordRequest;
import com.parkease.dto.auth.UserDTO;
import com.parkease.entity.User;
import com.parkease.exception.ResourceNotFoundException;
import com.parkease.repository.UserRepository;
import com.parkease.security.JwtService;

import lombok.RequiredArgsConstructor;
 
@Service
@RequiredArgsConstructor
public class AuthService {
 
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    
 
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
 
        var user = User.builder()
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .email(request.getEmail())
            .passwordHash(passwordEncoder.encode(request.getPassword()))
            .phone(request.getPhone())
            .role(User.Role.USER)
            .isActive(true)
            .isVerified(false)
            .build();
 
        userRepository.save(user);
        var token = jwtService.generateToken(user);
        return AuthResponse.builder().token(token).user(mapToUserDTO(user)).build();
    }
 
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        var user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        var token = jwtService.generateToken(user);
        return AuthResponse.builder().token(token).user(mapToUserDTO(user)).build();
    }
 
    @Transactional
    public void forgotPassword(String email) {
        var user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        // Generate token, save, and send email (simplified)
        String token = java.util.UUID.randomUUID().toString();
        // emailService.sendPasswordReset(user.getEmail(), token);
    }
 
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        var user = userRepository.findByResetPasswordToken(request.getToken())
            .orElseThrow(() -> new ResourceNotFoundException("Invalid or expired token"));
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
 
    public AuthResponse refresh(RefreshTokenRequest request) {
        // Validate refresh token and issue new access token
        String email = jwtService.extractUsername(request.getRefreshToken());
        var user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        var token = jwtService.generateToken(user);
        return AuthResponse.builder().token(token).user(mapToUserDTO(user)).build();
    }
 
    private UserDTO mapToUserDTO(User user) {
        return UserDTO.builder()
            .id(user.getId())
            .email(user.getEmail())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .phone(user.getPhone())
            .role(user.getRole().name())
            .build();
    }
}
 