package com.parkease.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class ParkingSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String slotNumber;
    private boolean occupied;

    public ParkingSlot() {}

    public ParkingSlot(String slotNumber, boolean occupied) {
        this.slotNumber = slotNumber;
        this.occupied = occupied;
    }

    public Long getId() { return id; }
    public String getSlotNumber() { return slotNumber; }
    public boolean isOccupied() { return occupied; }

    public void setSlotNumber(String slotNumber) { this.slotNumber = slotNumber; }
    public void setOccupied(boolean occupied) { this.occupied = occupied; }
}