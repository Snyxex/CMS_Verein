<?php
header('Content-Type: application/json');
include '../../db.php';

try {                                       
                                                //Query um Events aufsteigend nach deren Datum zu erhalten
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
        while ($row = mysqli_fetch_assoc($result)) {        //Formatiert die Events als Array 
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
    echo json_encode($events);          //gibt die formatierten Events zurück

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "error" => $e->getMessage()
    ]);
}
?>