package com.parkease.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.parkease.entity.ParkingLocation;
import com.parkease.repository.ParkingLocationRepository;

@Service
public class ParkingService {

    private final ParkingLocationRepository repo;

    public ParkingService(ParkingLocationRepository repo) {
        this.repo = repo;
    }

    public List<ParkingLocation> getSlots() {
        return repo.findAll();
    }

    public ParkingLocation addSlot(ParkingLocation slot) {
        return repo.save(slot);
    }
}