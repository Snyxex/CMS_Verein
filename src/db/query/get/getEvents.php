<?php
header('Content-Type: application/json');
include '../../db.php';

try {
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
            $events[] = [
                'event_id'    => (int)$row['event_id'],
                'title'       => $row['title'] ?? '',
                'event_date'  => $row['event_date'],
                'location'    => $row['location'] ?? '',
                'street'      => $row['street'] ?? '',
                'zip'         => $row['zip'] ?? '',
                'description' => $row['description'] ?? ''
            ];
        }
    }
    
    close($connection);
    echo json_encode($events);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "error" => $e->getMessage()
    ]);
}
?>