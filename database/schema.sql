-- ============================================================
-- SMART PARKING SPOT FINDER - DATABASE SCHEMA (MySQL)
-- ============================================================

CREATE DATABASE IF NOT EXISTS smart_parking;
USE smart_parking;

-- Users
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role ENUM('USER','ADMIN','OPERATOR') DEFAULT 'USER',
    profile_image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Vehicles
CREATE TABLE vehicles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    license_plate VARCHAR(20) NOT NULL,
    make VARCHAR(50),
    model VARCHAR(50),
    color VARCHAR(30),
    vehicle_type ENUM('COMPACT','SEDAN','SUV','TRUCK','MOTORCYCLE','ELECTRIC') DEFAULT 'SEDAN',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Parking Locations
CREATE TABLE parking_locations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20),
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    total_spots INT NOT NULL DEFAULT 0,
    available_spots INT NOT NULL DEFAULT 0,
    hourly_rate DECIMAL(10,2) NOT NULL,
    daily_rate DECIMAL(10,2),
    monthly_rate DECIMAL(10,2),
    is_covered BOOLEAN DEFAULT FALSE,
    has_ev_charging BOOLEAN DEFAULT FALSE,
    has_handicap_spots BOOLEAN DEFAULT FALSE,
    has_security BOOLEAN DEFAULT FALSE,
    is_24_hours BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(500),
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Parking Spots
CREATE TABLE parking_spots (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    location_id BIGINT NOT NULL,
    spot_number VARCHAR(20) NOT NULL,
    floor_level INT DEFAULT 1,
    spot_type ENUM('STANDARD','COMPACT','HANDICAP','EV_CHARGING','MOTORCYCLE','OVERSIZED') DEFAULT 'STANDARD',
    status ENUM('AVAILABLE','OCCUPIED','RESERVED','MAINTENANCE') DEFAULT 'AVAILABLE',
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (location_id) REFERENCES parking_locations(id) ON DELETE CASCADE,
    UNIQUE KEY unique_spot (location_id, spot_number)
);

-- Bookings
CREATE TABLE bookings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_reference VARCHAR(20) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    spot_id BIGINT NOT NULL,
    vehicle_id BIGINT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    actual_end_time TIMESTAMP,
    status ENUM('PENDING','CONFIRMED','ACTIVE','COMPLETED','CANCELLED','NO_SHOW') DEFAULT 'PENDING',
    total_amount DECIMAL(10,2) NOT NULL,
    duration_hours DECIMAL(10,2),
    notes TEXT,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (spot_id) REFERENCES parking_spots(id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

-- Payments
CREATE TABLE payments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    payment_reference VARCHAR(50) NOT NULL UNIQUE,
    booking_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method ENUM('CREDIT_CARD','DEBIT_CARD','PAYPAL','WALLET','UPI') NOT NULL,
    payment_status ENUM('PENDING','PROCESSING','COMPLETED','FAILED','REFUNDED') DEFAULT 'PENDING',
    transaction_id VARCHAR(255),
    card_last_four VARCHAR(4),
    card_brand VARCHAR(20),
    refund_amount DECIMAL(10,2) DEFAULT 0.00,
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Reviews
CREATE TABLE reviews (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    location_id BIGINT NOT NULL,
    booking_id BIGINT,
    rating INT NOT NULL,
    title VARCHAR(255),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (location_id) REFERENCES parking_locations(id)
);

-- Support Tickets
CREATE TABLE support_tickets (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    ticket_number VARCHAR(20) NOT NULL UNIQUE,
    user_id BIGINT,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    category ENUM('BOOKING','PAYMENT','TECHNICAL','GENERAL','COMPLAINT','FEEDBACK') NOT NULL,
    subject VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('OPEN','IN_PROGRESS','RESOLVED','CLOSED') DEFAULT 'OPEN',
    priority ENUM('LOW','MEDIUM','HIGH','URGENT') DEFAULT 'MEDIUM',
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Notifications
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('BOOKING','PAYMENT','REMINDER','PROMO','SYSTEM') DEFAULT 'SYSTEM',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_spots_location ON parking_spots(location_id);
CREATE INDEX idx_spots_status ON parking_spots(status);
CREATE INDEX idx_locations_city ON parking_locations(city);
CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_tickets_user ON support_tickets(user_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);

-- Sample Data
INSERT INTO parking_locations (name, address, city, state, zip_code, latitude, longitude, total_spots, available_spots, hourly_rate, daily_rate, is_covered, has_ev_charging, has_security, rating, total_reviews)
VALUES
('Downtown Central Parking','123 Main Street','New York','NY','10001',40.7128,-74.0060,200,45,5.00,35.00,TRUE,TRUE,TRUE,4.5,128),
('Airport Terminal Garage','1 Airport Blvd','New York','NY','10002',40.6413,-73.7781,500,120,8.00,50.00,TRUE,FALSE,TRUE,4.2,89),
('Midtown Smart Lot','456 Park Ave','New York','NY','10022',40.7549,-73.9840,100,23,6.50,40.00,FALSE,TRUE,FALSE,4.7,210),
('West Side Parking Hub','789 West Side Hwy','New York','NY','10036',40.7614,-74.0021,150,67,4.00,28.00,FALSE,FALSE,TRUE,3.9,54);