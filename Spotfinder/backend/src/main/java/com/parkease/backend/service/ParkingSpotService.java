package com.parkease.backend.service;

import com.parkease.backend.model.ParkingSpot;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ParkingSpotService {

    private final List<ParkingSpot> parkingSpots = new ArrayList<>();

    public ParkingSpotService() {
        parkingSpots.add(new ParkingSpot("1", "Level 1 - A1", true));
        parkingSpots.add(new ParkingSpot("2", "Level 1 - A2", false));
        parkingSpots.add(new ParkingSpot("3", "Level 1 - A3", true));
        parkingSpots.add(new ParkingSpot("4", "Level 2 - B1", true));
    }

    public List<ParkingSpot> getAllSpots() {
        return parkingSpots;
    }

    public ParkingSpot updateAvailability(String id, boolean isAvailable) {
        Optional<ParkingSpot> spotOpt = parkingSpots.stream()
                .filter(spot -> spot.getId().equals(id))
                .findFirst();

        if (spotOpt.isPresent()) {
            ParkingSpot spot = spotOpt.get();
            spot.setAvailable(isAvailable);
            return spot;
        }
        throw new RuntimeException("Parking spot not found with id: " + id);
    }
}
