-- 1. Zuerst einen Verein anlegen (Club)
INSERT INTO clubs (name, description, founding_date) 
VALUES ('SC Beispieldorf e.V.', 'Ein traditionsreicher Sportverein für Jung und Alt.', '1920-05-15');

-- 2. Admins anlegen (Username: admin / Passwort: password123)
-- Hinweis: In einer echten App müssen Passwörter mit PHP password_hash() verschlüsselt sein.
INSERT INTO users (club_id, username, password, role, email) 
VALUES (1, 'admin', 'test123', 'Super-Admin', 'admin@beispieldorf.de');

-- 3. News / Beiträge (Posts)
INSERT INTO posts (club_id, title, content, image) 
VALUES 
(1, 'Großer Erfolg beim Sommerturnier', 'Unsere erste Mannschaft hat am vergangenen Wochenende den ersten Platz belegt...', 'turnier.jpg'),
(1, 'Jahreshauptversammlung 2026', 'Wir laden alle Mitglieder herzlich ein, am 20. Mai im Vereinsheim zu erscheinen.', 'versammlung.jpg');

-- 4. Termine (Events)
INSERT INTO events (club_id, title, event_date, location, street, zip, description) 
VALUES 
(1, 'Saison-Eröffnung', '2026-08-01', 'Sportplatz Beispieldorf', 'Sportweg 1', '12345', 'Großes Fest für alle Abteilungen.'),
(1, 'Weihnachtsfeier', '2026-12-15', 'Gasthof zum Hirschen', 'Hauptstraße 12', '12345', 'Gemütliches Beisammensein zum Jahresabschluss.');

-- 5. Gästebuch-Einträge
INSERT INTO guestbook (club_id, name, message) 
VALUES 
(1, 'Max Mustermann', 'Tolle Webseite! Endlich kann man die Termine auch online sehen.'),
(1, 'Erika Schmidt', 'Ich freue mich schon auf das nächste Sommerfest.');

-- 6. Vereinsmitglieder (für die Mitgliederliste)
INSERT INTO members (club_id, name, role, description) 
VALUES 
(1, 'Thomas Müller', '1. Vorsitzender', 'Seit 10 Jahren aktiv im Vorstand tätig.'),
(1, 'Sarah Wagner', 'Jugendwartin', 'Zuständig für die Betreuung unserer Nachwuchstalente.'),
(1, 'Bernd Becker', 'Schatzmeister', 'Kümmert sich um die Finanzen und Sponsoren.');