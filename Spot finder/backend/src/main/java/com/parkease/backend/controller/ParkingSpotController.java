package com.parkease.backend.controller;

import com.parkease.backend.model.ParkingSpot;
import com.parkease.backend.service.ParkingSpotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/spots")
public class ParkingSpotController {

    private final ParkingSpotService parkingSpotService;

    @Autowired
    public ParkingSpotController(ParkingSpotService parkingSpotService) {
        this.parkingSpotService = parkingSpotService;
    }

    @GetMapping
    public List<ParkingSpot> getAllSpots() {
        return parkingSpotService.getAllSpots();
    }

    @PutMapping("/{id}")
    public ParkingSpot updateAvailability(@PathVariable String id,
            @RequestBody java.util.Map<String, Boolean> updates) {
        if (!updates.containsKey("isAvailable")) {
            throw new IllegalArgumentException("Request body must contain 'isAvailable' field");
        }
        return parkingSpotService.updateAvailability(id, updates.get("isAvailable"));
    }
}
