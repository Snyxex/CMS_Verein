<?php
header('Content-Type: application/json');
include '../../../db.php';

$data = json_decode(file_get_contents("php://input"), true);
$club_id = 1; 

$id = !empty($data['id']) ? (int)$data['id'] : null;
$title = mysqli_real_escape_with_connection($connection, $data['title']);
$date = mysqli_real_escape_with_connection($connection, $data['date']);
$loc = mysqli_real_escape_with_connection($connection, $data['location']);
$street = mysqli_real_escape_with_connection($connection, $data['street']);
$zip = mysqli_real_escape_with_connection($connection, $data['zip']);
$desc = mysqli_real_escape_with_connection($connection, $data['description']);

if ($id) {
    $sql = "UPDATE events SET title='$title', event_date='$date', location='$loc', street='$street', zip='$zip', description='$desc' WHERE event_id=$id AND club_id=$club_id";
} else {
    $sql = "INSERT INTO events (club_id, title, event_date, location, street, zip, description) VALUES ($club_id, '$title', '$date', '$loc', '$street', '$zip', '$desc')";
}

if (query($connection, $sql)) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => mysqli_error($connection)]);
}

function mysqli_real_escape_with_connection($con, $val) {
    return mysqli_real_escape_string($con, $val ?? '');
}