package com.parkease.service;
 
import com.parkease.dto.parking.*;
import com.parkease.entity.*;
import com.parkease.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
 
import java.util.List;
import java.util.stream.Collectors;
 
@Service
@RequiredArgsConstructor
public class ParkingLocationService {
 
    private final ParkingLocationRepository locationRepository;
    private final ParkingSpotRepository spotRepository;
 
    public Page<ParkingLocationDTO> search(ParkingSearchFilter filter, Pageable pageable) {
        return locationRepository.search(filter, pageable).map(this::mapToDTO);
    }
 
    public ParkingLocationDetailDTO getById(Long id) {
        var location = locationRepository.findById(id)
            .orElseThrow(() -> new com.parkease.exception.ResourceNotFoundException("Location not found"));
        return mapToDetailDTO(location);
    }
 
    public List<ParkingSpotDTO> getSpots(Long locationId, String status, Integer floor) {
        var spots = status != null
            ? spotRepository.findByLocationIdAndStatus(locationId, ParkingSpot.SpotStatus.valueOf(status), floor)
            : spotRepository.findByLocationId(locationId, floor);
        return spots.stream().map(this::mapSpotToDTO).collect(Collectors.toList());
    }
 
    public List<ParkingLocationDTO> getNearby(double lat, double lng, double radiusKm) {
        return locationRepository.findNearby(lat, lng, radiusKm).stream()
            .map(this::mapToDTO).collect(Collectors.toList());
    }
 
    public ParkingLocationDTO create(CreateParkingLocationRequest req) {
        var location = ParkingLocation.builder()
            .name(req.getName()).address(req.getAddress())
            .city(req.getCity()).state(req.getState())
            .latitude(req.getLatitude()).longitude(req.getLongitude())
            .hourlyRate(req.getHourlyRate()).dailyRate(req.getDailyRate())
            .totalSpots(req.getTotalSpots()).availableSpots(req.getTotalSpots())
            .isCovered(req.isCovered()).hasEvCharging(req.isHasEvCharging())
            .hasSecurity(req.isHasSecurity()).is24Hours(req.is24Hours())
            .isActive(true).build();
        return mapToDTO(locationRepository.save(location));
    }
 
    public ParkingLocationDTO update(Long id, UpdateParkingLocationRequest req) {
        var location = locationRepository.findById(id)
            .orElseThrow(() -> new com.parkease.exception.ResourceNotFoundException("Location not found"));
        if (req.getHourlyRate() != null) location.setHourlyRate(req.getHourlyRate());
        if (req.getName() != null) location.setName(req.getName());
        return mapToDTO(locationRepository.save(location));
    }
 
    private ParkingLocationDTO mapToDTO(ParkingLocation l) {
        return ParkingLocationDTO.builder()
            .id(l.getId()).name(l.getName()).address(l.getAddress())
            .city(l.getCity()).state(l.getState())
            .latitude(l.getLatitude()).longitude(l.getLongitude())
            .totalSpots(l.getTotalSpots()).availableSpots(l.getAvailableSpots())
            .hourlyRate(l.getHourlyRate()).dailyRate(l.getDailyRate())
            .isCovered(l.isCovered()).hasEvCharging(l.isHasEvCharging())
            .hasSecurity(l.isHasSecurity()).is24Hours(l.is24Hours())
            .rating(l.getRating()).totalReviews(l.getTotalReviews())
            .build();
    }
 
    private ParkingLocationDetailDTO mapToDetailDTO(ParkingLocation l) {
        return ParkingLocationDetailDTO.builder()
            .id(l.getId()).name(l.getName()).address(l.getAddress())
            .city(l.getCity()).state(l.getState())
            .latitude(l.getLatitude()).longitude(l.getLongitude())
            .totalSpots(l.getTotalSpots()).availableSpots(l.getAvailableSpots())
            .hourlyRate(l.getHourlyRate()).dailyRate(l.getDailyRate())
            .monthlyRate(l.getMonthlyRate())
            .isCovered(l.isCovered()).hasEvCharging(l.isHasEvCharging())
            .hasSecurity(l.isHasSecurity()).is24Hours(l.is24Hours())
            .rating(l.getRating()).totalReviews(l.getTotalReviews())
            .build();
    }
 
    private ParkingSpotDTO mapSpotToDTO(ParkingSpot s) {
        return ParkingSpotDTO.builder()
            .id(s.getId()).spotNumber(s.getSpotNumber())
            .floorLevel(s.getFloorLevel())
            .spotType(s.getSpotType().name()).status(s.getStatus().name())
            .build();
    }
}
 