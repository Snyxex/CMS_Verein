<?php
header('Content-Type: application/json');
include '../../../db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['type']) || !isset($data['id'])) {
    echo json_encode(["success" => false, "message" => "Ungültige Daten"]);
    exit;
}

$type = $data['type'];
$id = (int)$data['id'];

// Sicherheit: Je nach Typ die richtige Tabelle und Spalte wählen
if ($type === 'Admin') {
    $sql = "DELETE FROM users WHERE user_id = $id";
} else {
    $sql = "DELETE FROM members WHERE member_id = $id";
}

if (mysqli_query($connection, $sql)) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => mysqli_error($connection)]);
}

mysqli_close($connection);
?>