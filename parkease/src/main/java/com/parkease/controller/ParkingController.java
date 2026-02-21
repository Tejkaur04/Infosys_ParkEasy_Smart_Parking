package com.parkease.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.parkease.model.ParkingSlot;
import com.parkease.service.ParkingService;

@RestController
@RequestMapping("/api/parking")
public class ParkingController {

    private final ParkingService service;

    public ParkingController(ParkingService service) {
        this.service = service;
    }

    @GetMapping
    public List<ParkingSlot> getAll() {
        return service.getSlots();
    }

    @PostMapping
    public ParkingSlot add(@RequestBody ParkingSlot slot) {
        return service.addSlot(slot);
    }
}