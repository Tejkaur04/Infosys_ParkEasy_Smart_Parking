package com.parkease.controller;
 
import com.parkease.dto.parking.*;
import com.parkease.service.ParkingLocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
 
import java.util.List;
 
@RestController
@RequestMapping("/parking-locations")
@RequiredArgsConstructor
public class ParkingLocationController {
 
    private final ParkingLocationService parkingLocationService;
 
    /** Search locations with filters */
    @GetMapping("/search")
    public ResponseEntity<Page<ParkingLocationDTO>> search(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Boolean hasEvCharging,
            @RequestParam(required = false) Boolean isCovered,
            @RequestParam(required = false) Boolean hasSecurity,
            @RequestParam(required = false) Double maxRate,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @RequestParam(defaultValue = "5") double radiusKm,
            Pageable pageable) {
 
        ParkingSearchFilter filter = ParkingSearchFilter.builder()
            .city(city).query(query).hasEvCharging(hasEvCharging)
            .isCovered(isCovered).hasSecurity(hasSecurity)
            .maxRate(maxRate).latitude(lat).longitude(lng)
            .radiusKm(radiusKm).build();
 
        return ResponseEntity.ok(parkingLocationService.search(filter, pageable));
    }
 
    @GetMapping("/{id}")
    public ResponseEntity<ParkingLocationDetailDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(parkingLocationService.getById(id));
    }
 
    @GetMapping("/{id}/spots")
    public ResponseEntity<List<ParkingSpotDTO>> getSpots(
            @PathVariable Long id,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer floor) {
        return ResponseEntity.ok(parkingLocationService.getSpots(id, status, floor));
    }
 
    @GetMapping("/nearby")
    public ResponseEntity<List<ParkingLocationDTO>> getNearby(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "3") double radiusKm) {
        return ResponseEntity.ok(parkingLocationService.getNearby(lat, lng, radiusKm));
    }
 
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ParkingLocationDTO> create(@RequestBody CreateParkingLocationRequest request) {
        return ResponseEntity.ok(parkingLocationService.create(request));
    }
 
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ParkingLocationDTO> update(@PathVariable Long id, @RequestBody UpdateParkingLocationRequest request) {
        return ResponseEntity.ok(parkingLocationService.update(id, request));
    }
}
 