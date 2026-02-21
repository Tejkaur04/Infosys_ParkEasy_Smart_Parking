package com.parkease.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.parkease.model.ParkingSlot;

public interface ParkingRepository
        extends JpaRepository<ParkingSlot, Long> {
}