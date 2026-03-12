package com.parkease.backend.model;

public class ParkingSpot {
    private String id;
    private String location;
    private boolean isAvailable;

    public ParkingSpot() {
    }

    public ParkingSpot(String id, String location, boolean isAvailable) {
        this.id = id;
        this.location = location;
        this.isAvailable = isAvailable;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean available) {
        isAvailable = available;
    }
}
