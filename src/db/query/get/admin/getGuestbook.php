<?php
header('Content-Type: application/json');
include '../../../db.php';

$club_id = 1; 

$sql = "SELECT id, name, message, created_at 
        FROM guestbook 
        WHERE club_id = $club_id 
        ORDER BY created_at DESC";

$result = mysqli_query($connection, $sql);
$entries = [];

while($row = mysqli_fetch_assoc($result)) {
    // Datum schöner formatieren
    $row['date_formatted'] = date('d.m.Y H:i', strtotime($row['created_at']));
    $entries[] = $row;
}

echo json_encode($entries);
mysqli_close($connection);