-- Δημιουργία του πίνακα των χρηστών
CREATE TABLE `users` (
  `user_id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Δημιουργία του πίνακα των εστιατορίων
CREATE TABLE `restaurants` (
  `restaurant_id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `image_url` VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Δημιουργία του πίνακα των κρατήσεων
CREATE TABLE `reservations` (
  `reservation_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `restaurant_id` INT NOT NULL,
  `reservation_date` DATE NOT NULL,
  `reservation_time` TIME NOT NULL,
  `people_count` INT NOT NULL,
  `status` VARCHAR(20) DEFAULT 'confirmed',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`restaurant_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Προσθήκη μερικών αρχικών δεδομένων για δοκιμή
INSERT INTO `restaurants` (`name`, `location`, `description`, `image_url`) VALUES
('Bar B. Q', 'Αθήνα', 'Ζουμερά burgers και αυθεντικές αμερικάνικες γεύσεις.', 'https://example.com/images/bbq.jpg'),
('Ergon House', 'Αθήνα', 'Μοντέρνα ελληνική κουζίνα σε έναν εντυπωσιακό χώρο.', 'https://example.com/images/ergon.jpg'),
('Το Μαύρο Πρόβατο', 'Παγκράτι', 'Δημιουργική ελληνική κουζίνα με έμφαση στα μεζεδάκια.', 'https://example.com/images/provato.jpg'),
('Kitchen Bar', 'Θεσσαλονίκη', 'All-day bar restaurant με θέα τον Θερμαϊκό.', 'https://example.com/images/kitchenbar.jpg');