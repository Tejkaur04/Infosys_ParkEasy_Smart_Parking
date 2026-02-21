package com.parkease.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.parkease.model.ParkingSlot;
import com.parkease.repository.ParkingRepository;

@Service
public class ParkingService {

    private final ParkingRepository repo;

    public ParkingService(ParkingRepository repo) {
        this.repo = repo;
    }

    public List<ParkingSlot> getSlots() {
        return repo.findAll();
    }

    public ParkingSlot addSlot(ParkingSlot slot) {
        return repo.save(slot);
    }
}