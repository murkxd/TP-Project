CREATE DATABASE tp_ab;
USE tp_ab;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select * from users;

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

select * from cars;

ALTER TABLE cars ADD COLUMN price INT NOT NULL;
ALTER TABLE cars ADD COLUMN images TEXT;
ALTER TABLE cars ADD COLUMN contact_phone VARCHAR(30);

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

select * from car_features;

DELETE FROM car_features;
DELETE FROM cars;

DELETE FROM features;

INSERT INTO features (name) VALUES
-- Bezpečnost & asistenty
('ABS, ESP, ASR'),
('Asistent jízdy v pruhu'),
('Asistent rozjezdu do kopce'),
('Hlídání mrtvého úhlu'),
('Samočinné stmívání zrcátek'),
('Tísňový systém SOS'),
('ISOFIX'),
('Automatická parkovací brzda'),
('Tempomat'),
('Adaptivní tempomat'),
('Automatické dálkové světlomety'),
('Parkovací senzory'),
('Zadní parkovací kamera'),
('360° kamera'),

-- Pohodlí
('Klimatizace'),
('Dvouzónová klimatizace'),
('Vyhřívaná sedadla'),
('Ventilovaná sedadla'),
('Elektrická sedadla'),
('Masážní sedadla'),
('Vyhřívaný volant'),
('Nezávislé topení'),
('Elektrické víko kufru'),
('Bezdotykové odemykání/start'),
('Dešťový senzor'),
('Ambientní osvětlení'),
('Dělená zadní sedadla'),
('Head-up displej'),

-- Technika a zábava
('Integrace chytrého telefonu'),
('Prémiový audiosystém'),
('Zadní infotainment systém'),
('Navigace'),
('Bluetooth'),
('Bezdrátové nabíjení'),
('DAB rádio'),
('USB porty'),

-- Exteriér & užitek
('Střešní okno'),
('Panoramatická střecha'),
('Mlhovky'),
('Střešní nosiče'),
('Tažné zařízení');