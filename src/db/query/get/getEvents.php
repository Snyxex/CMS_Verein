<?php
header('Content-Type: application/json');
include '../../db.php';

try {
    // Wir holen alle Spalten, die du für die Anzeige brauchst
    $sql = "SELECT 
                event_id, 
                title, 
                event_date, 
                location, 
                street, 
                zip, 
                description 
            FROM events 
            ORDER BY event_date ASC";

    $result = query($connection, $sql); 

    $events = [];
    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            // Wir bereiten die Daten für JavaScript vor
            $events[] = [
                'id'          => $row['event_id'],
                'title'       => $row['title'],
                'start'       => $row['event_date'], // 'start' ist Standard für viele Kalender
                'location'    => $row['location'],
                'address'     => $row['street'] . ', ' . $row['zip'], // Adresse zusammenfügen
                'description' => $row['description']
            ];
        }
    }
    
    echo json_encode($events);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}