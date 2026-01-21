<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Wir suchen die Datei db.php dynamisch
function findFile($filename, $startDir) {
    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($startDir));
    foreach ($iterator as $file) {
        if ($file->getFilename() === $filename) {
            return $file->getPathname();
        }
    }
    return null;
}

// Suche im gesamten Projektordner (CMS_Verein)
$projectRoot = '/Applications/XAMPP/xamppfiles/htdocs/CMS_Verein';
$dbPath = findFile('db.php', $projectRoot);

if ($dbPath) {
    require_once $dbPath;
} else {
    die(json_encode(["error" => "db.php wurde im gesamten Projekt nicht gefunden!"]));
}

// Abfrage ausführen
try {
    $sql = "SELECT event_id, title, event_date as date, location as room, description FROM events";
    // Nutzt eure mysqli-Funktion
    $result = query($connection, $sql); 

    $events = [];
    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            $events[] = $row;
        }
    }
    echo json_encode($events);
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}