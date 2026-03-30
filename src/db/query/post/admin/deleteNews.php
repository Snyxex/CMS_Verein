<?php
header('Content-Type: application/json');
include '../../../db.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = (int)$data['id'];
$club_id = 1;

$sql = "DELETE FROM news WHERE id = $id AND club_id = $club_id";
if (mysqli_query($connection, $sql)) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false]);
}
mysqli_close($connection);