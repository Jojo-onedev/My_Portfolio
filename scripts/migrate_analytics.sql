-- Add geolocation columns to analytics table
ALTER TABLE analytics ADD COLUMN country TEXT;
ALTER TABLE analytics ADD COLUMN city TEXT;
