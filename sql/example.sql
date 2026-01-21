INSERT INTO clubs (name, description, founding_date) VALUES 
('FC Beispielstadt 1920', 'Ein traditionsreicher Fußballverein aus dem Herzen der Stadt.', '1920-05-15'),
('Schachfreunde Logik', 'Der Treffpunkt für Strategen und Denker jeden Alters.', '1985-11-01');

INSERT INTO users (club_id, username, password, email) VALUES 
(1, 'admin_fc', 'geheim123', 'admin@fc-beispielstadt.de'),
(2, 'schach_master', 'checkmate44', 'info@schachfreunde-logik.de');

INSERT INTO posts (club_id, title, content) VALUES 
(1, 'Sieg im Lokalderby!', 'Unsere erste Mannschaft hat gestern sensationell 3:1 gewonnen.'),
(1, 'Neuer Rasenplatz fertig', 'Ab nächster Woche kann auf dem neuen Grün trainiert werden.'),
(2, 'Einladung zum Schachturnier', 'Am 15. des nächsten Monats findet unser offenes Sommer-Turnier statt.');

INSERT INTO events (club_id, title, event_date, location, street, zip) VALUES 
(1, 'Jahreshauptversammlung', '2025-03-10', 'Vereinsheim am Sportplatz', 'Sportweg 1', '12345'),
(1, 'Sommerfest', '2025-07-20', 'Festwiese', 'Wiesenstraße 10', '12345'),
(2, 'Blitzschach-Abend', '2025-02-05', 'Café Denkpause', 'Schachmatt-Allee 64', '54321');

INSERT INTO guestbook (club_id, name, email, message) VALUES 
(1, 'Max Mustermann', 'max@web.de', 'Tolle Website! Viel Erfolg für die Rückrunde.'),
(2, 'Sven Springer', NULL, 'Gibt es bei euch auch Jugendtraining?');

INSERT INTO members (club_id, name, role, description) VALUES 
(1, 'Thomas Trainer', 'Cheftrainer', 'Seit 10 Jahren im Verein und verantwortlich für die Taktik.'),
(1, 'Sabine Schatzmeister', 'Kassiererin', 'Kümmert sich um die Finanzen und Sponsoren.'),
(2, 'Dr. Magnus Matt', '1. Vorsitzender', 'Großmeister und Gründungsmitglied.');


--------------------------
-- überprüfungen der daten
-------------------------
SELECT clubs.name AS Verein, posts.title AS Titel, posts.created_at 
FROM posts 
JOIN clubs ON posts.club_id = clubs.club_id;