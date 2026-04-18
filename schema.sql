-- Database Schema for Portfolio Admin

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  link TEXT,
  category TEXT,
  performance_data TEXT, -- JSON string for stats
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  role TEXT,
  quote TEXT NOT NULL,
  avatar TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Analytics Table
CREATE TABLE IF NOT EXISTS analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_path TEXT NOT NULL,
  visitor_id TEXT,
  user_agent TEXT,
  referrer TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Site Settings Table (Global config)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- Initial Settings
INSERT OR IGNORE INTO settings (key, value) VALUES ('site_title', 'J.FOLIO');
INSERT OR IGNORE INTO settings (key, value) VALUES ('hero_title', 'Discover Digital Art & Modern Web.');
INSERT OR IGNORE INTO settings (key, value) VALUES ('contact_email', 'jonathan.bationo@example.com');
