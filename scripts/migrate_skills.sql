-- Create skills table for the Skills Manager
CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    level TEXT NOT NULL, -- Expert, Avancé, Intermédiaire, Débutant
    category TEXT DEFAULT 'tech', -- tech, design, tool
    color TEXT DEFAULT 'text-primary', -- Tailwind text color class
    bg TEXT DEFAULT 'bg-primary/5', -- Tailwind bg color class
    border TEXT DEFAULT 'hover:border-primary/40', -- Tailwind border color class
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed some initial data from the current hardcoded list
INSERT INTO skills (name, level, color, bg, border) VALUES ('HTML / CSS', 'Avancé', 'text-blue-400', 'bg-blue-400/5', 'hover:border-blue-400/40');
INSERT INTO skills (name, level, color, bg, border) VALUES ('React / Next.js', 'Intermédiaire', 'text-blue-400', 'bg-blue-400/5', 'hover:border-blue-400/40');
INSERT INTO skills (name, level, color, bg, border) VALUES ('JavaScript', 'Intermédiaire', 'text-yellow-400', 'bg-yellow-400/5', 'hover:border-yellow-400/40');
INSERT INTO skills (name, level, color, bg, border) VALUES ('Tailwind CSS', 'Intermédiaire', 'text-teal-400', 'bg-teal-400/5', 'hover:border-teal-400/40');
INSERT INTO skills (name, level, color, bg, border) VALUES ('GSAP / Framer', 'Intermédiaire', 'text-green-400', 'bg-green-400/5', 'hover:border-green-400/40');
INSERT INTO skills (name, level, color, bg, border) VALUES ('Node.js / SQL', 'Intermédiaire', 'text-emerald-500', 'bg-emerald-500/5', 'hover:border-emerald-500/40');
INSERT INTO skills (name, level, color, bg, border) VALUES ('Git / CI-CD', 'Intermédiaire', 'text-orange-500', 'bg-orange-500/5', 'hover:border-orange-500/40');
INSERT INTO skills (name, level, color, bg, border) VALUES ('UI/UX Design', 'Intermédiaire', 'text-pink-500', 'bg-pink-500/5', 'hover:border-pink-500/40');
INSERT INTO skills (name, level, color, bg, border) VALUES ('Turso / LibSQL', 'Debutant', 'text-cyan-400', 'bg-cyan-400/5', 'hover:border-cyan-400/40');
