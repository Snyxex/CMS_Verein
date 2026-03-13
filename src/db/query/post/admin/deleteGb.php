<?php
header('Content-Type: application/json');
include '../../../db.php';

// Wir erwarten eine ID via POST
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    echo json_encode(["success" => false, "message" => "Keine ID übergeben."]);
    exit;
}

$id = (int)$data['id'];
$club_id = 1; // Später dynamisch per Session

// Löschbefehl mit Sicherheitsprüfung (club_id stellt sicher, dass man nur eigene Einträge löscht)
$sql = "DELETE FROM guestbook WHERE id = $id AND club_id = $club_id";

if (mysqli_query($connection, $sql)) {
    if (mysqli_affected_rows($connection) > 0) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Eintrag nicht gefunden oder keine Berechtigung."]);
    }
} else {
    echo json_encode(["success" => false, "message" => mysqli_error($connection)]);
}

mysqli_close($connection);
?>