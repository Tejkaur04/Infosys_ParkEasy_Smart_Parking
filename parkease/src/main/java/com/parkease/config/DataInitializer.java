package com.parkease.config;

import com.parkease.entity.ParkingSpot;
import com.parkease.repository.ParkingSpotRepository;
import com.parkease.repository.ParkingLocationRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    public org.springframework.boot.CommandLineRunner initSpots(
            ParkingSpotRepository spotRepo,
            ParkingLocationRepository locRepo) {

        return args -> {

            var location = locRepo.findById(1L).orElse(null);
            if (location == null) return;

            if (spotRepo.count() > 0) return; // prevent duplicate insert

            for (int i = 1; i <= 40; i++) {
                spotRepo.save(ParkingSpot.builder()
                        .location(location)
                        .spotNumber("A" + i)
                        .floorLevel(1)
                        .status(i % 4 == 0 ? ParkingSpot.SpotStatus.OCCUPIED : ParkingSpot.SpotStatus.AVAILABLE)
                        .isActive(true)
                        .build());
            }
        };
    }
}