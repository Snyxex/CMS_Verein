<?php
// Versuche den Pfad absolut zu setzen, damit es keine Verwirrung gibt
$dbPath = __DIR__ . '/../../db.php';

if (file_exists($dbPath)) {
    include $dbPath;
} else {
    die("Fehler: db.php wurde nicht gefunden unter: " . $dbPath);
}

// Prüfen ob $connection existiert (aus db.php)
if (!isset($connection)) {
    die("Fehler: Die Variable \$connection wurde in db.php nicht definiert.");
}

$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;
if ($offset < 0) $offset = 0;

$sql = "SELECT * FROM members ORDER BY created_at DESC LIMIT 6 OFFSET $offset";

// Hier könnte der Fehler liegen, falls 'query' keine Standard-Funktion ist
$result = mysqli_query($connection, $sql); 

$news_items = [];
if ($result && mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $news_items[] = $row;
    }
}
?>