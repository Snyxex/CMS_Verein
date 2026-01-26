<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);
include '../../db.php';

// Abfrage ausführen
try {
    $sql = "SELECT event_id, title, event_date as date, location as room, description FROM events";
    
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