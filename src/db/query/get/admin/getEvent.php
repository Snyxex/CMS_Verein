<?php
header('Content-Type: application/json');
include '../../../db.php';

// Später kannst du die club_id aus der Session holen
$club_id = 1; 

// Wir holen alle Spalten und sortieren nach Datum aufsteigend
$sql = "SELECT * FROM events 
        WHERE club_id = $club_id 
        ORDER BY event_date ASC";

$result = mysqli_query($connection, $sql);
$events = [];

if ($result) {
    while($row = mysqli_fetch_assoc($result)) {
        $events[] = $row;
    }
    echo json_encode($events);
} else {
    echo json_encode(["error" => mysqli_error($connection)]);
}

mysqli_close($connection);
?>