CREATE DATABASE tp_ab;
USE tp_ab;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    first_registration_year INT NOT NULL,
    first_registration_month ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '-') NOT NULL,
    mileage INT NOT NULL,
    doors ENUM('2/3', '4/5') NOT NULL,
    fuel_type ENUM('Petrol', 'Diesel', 'Electric', 'LPG', 'CNG', 'Hybrid', 'Hydrogen', 'Other') NOT NULL,
    power_kw INT NOT NULL,
    exterior_color VARCHAR(30) NOT NULL,
    interior_material ENUM('Full Leather', 'Part Leather', 'Alcantara', 'Cloth', 'Other') NOT NULL,
    interior_color ENUM('White', 'Gray', 'Black', 'Beige', 'Brown', 'Other') NOT NULL,
    headlight_type ENUM('Bi-Xenon', 'Xenon', 'LED', 'Laser', 'Halogen', 'Other') NOT NULL,
    drivetrain ENUM('FWD', 'RWD', 'AWD') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE features (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE car_features (
    car_id INT NOT NULL,
    feature_id INT NOT NULL,
    PRIMARY KEY (car_id, feature_id),
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
    FOREIGN KEY (feature_id) REFERENCES features(id) ON DELETE CASCADE
);

INSERT INTO features (name) VALUES 
-- Safety & Driving Assistance
('ABS, ESP, ASR'),
('Lane Assist'),
('Hill Start Assist'),
('Blind Spot Assist'),
('Auto Dimming Mirrors'),
('SOS Emergency System'),
('ISOFIX'),
('Automatic Parking Brake'),
('Cruise Control'),
('Adaptive Cruise Control'),
('Automatic High Beams'),
('Parking Sensors'),
('Rear Parking Camera'),
('360-Degree Camera'),

-- Comfort & Convenience
('A/C'),
('Automatic Climate Control'),
('Heated Seats'),
('Ventilated Seats'),
('Electric Seats'),
('Massage Seats'),
('Heated Steering Wheel'),
('Auxiliary Heating'),
('Electric Tailgate'),
('Keyless Entry & Start'),
('Rain Sensor'),
('Ambient Lighting'),
('Split Folding Rear Seats'),
('Heads-up Display'),

-- Tech & Infotainment
('Smartphone Integration'),
('Premium Sound System'),
('Rear Entertainment System'),
('Navigation System'),
('Bluetooth'),
('Wireless Charging'),
('DAB Radio'),
('USB Ports'),

-- Exterior & Utility
('Sunroof'),
('Panoramic Roof'),
('Fog Lights'),
('Roof Rails'),
('Towing Package');