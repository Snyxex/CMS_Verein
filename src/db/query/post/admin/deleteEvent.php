<?php
header('Content-Type: application/json');
include '../../../db.php';

$data = json_decode(file_get_contents("php://input"), true);
$club_id = 1; 

if (!isset($data['id'])) {
    echo json_encode(["success" => false, "message" => "ID fehlt"]);
    exit;
}

$id = (int)$data['id'];

// Sicherheit: Prüfen, ob das Event auch wirklich zu diesem Club gehört
$sql = "DELETE FROM events WHERE event_id = $id AND club_id = $club_id";

if (mysqli_query($connection, $sql)) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => mysqli_error($connection)]);
}

mysqli_close($connection);
?>