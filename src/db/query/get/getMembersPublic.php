<?php
// Teilt dem Browser mit, dass die Antwort im JSON-Format gesendet wird
header('Content-Type: application/json');

// Bindet die Datenbank-Konfiguration und die Verbindung ein
include '../../db.php';

try {
    // Festlegen der Vereins-ID (könnte später dynamisch per $_GET kommen)
    $club_id = 1; 

    // SQL-Befehl: Wählt Name, Rolle, Bild und Beschreibung der Mitglieder dieses Vereins
    $sql = "SELECT name, role, picture, description FROM members WHERE club_id = $club_id";
    
    // Führt die Abfrage mit der Funktion aus deiner db.php aus
    $result = query($connection, $sql);

    // Array vorbereiten, in dem die Mitglieder gespeichert werden
    $members = [];
    
    // Wenn Daten gefunden wurden, zeilenweise in das Array übertragen
    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            $members[] = $row;
        }
    }

    // Wandelt das PHP-Array in einen JSON-String um und sendet ihn an das JavaScript
    echo json_encode($members);

} catch (Exception $e) {
    // Falls ein Fehler auftritt: Fehlermeldung als JSON senden und HTTP-Status 500 setzen
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}

// Schließt die Datenbankverbindung (Funktion aus db.php)
close($connection);
?>