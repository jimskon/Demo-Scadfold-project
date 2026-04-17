CREATE TABLE papers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    authors TEXT,
    year INT,
    url TEXT,
    status ENUM('to_read', 'reading', 'read') DEFAULT 'to_read',
    tags TEXT,
    summary TEXT,
    notes TEXT,
    date_added DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_read DATETIME NULL
);
