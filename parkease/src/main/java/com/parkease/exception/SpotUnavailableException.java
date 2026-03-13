package com.parkease.exception;

public class SpotUnavailableException extends RuntimeException {

    public SpotUnavailableException(String message) {
        super(message);
    }
}