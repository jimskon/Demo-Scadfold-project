#!/bin/bash

# Exit on error
set -e

# Load .env file
ENV_FILE="../.env"

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: .env file not found at $ENV_FILE"
  exit 1
fi

# Export variables from .env
set -o allexport
source "$ENV_FILE"
set +o allexport

# Check required variables
if [ -z "$DB_HOST" ] || [ -z "$DB_USER" ] || [ -z "$DB_NAME" ]; then
  echo "Error: Missing required DB environment variables"
  exit 1
fi

echo "Connecting to database: $DB_NAME at $DB_HOST"

mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" <<EOF

CREATE TABLE IF NOT EXISTS papers (
    id INT AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(500) NOT NULL,
    authors TEXT,
    year INT,
    venue VARCHAR(255),

    doi VARCHAR(255),
    url TEXT,
    pdf_path TEXT,

    status ENUM('to_read', 'reading', 'read', 'important', 'skip') DEFAULT 'to_read',

    date_added DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_read DATETIME NULL,

    rating INT NULL,
    priority INT DEFAULT 3,

    tags TEXT,
    summary TEXT,
    notes TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

EOF

echo "Papers table created (or already exists)."
