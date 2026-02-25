<?php
header('Content-Type: application/json');
include '../../../db.php';
$data = json_decode(file_get_contents("php://input"), true);

$type = $data['type'];
$name = $connection->real_escape_string($data['name']);
$email = $connection->real_escape_string($data['email']);
$role = $connection->real_escape_string($data['role']);
$id = $data['id'];

if ($type === 'Admin') {
    $pw = !empty($data['password']) ? ", password='".password_hash($data['password'], PASSWORD_DEFAULT)."'" : "";
    if ($id) {
        $sql = "UPDATE users SET username='$name', email='$email', role='$role' $pw WHERE user_id=$id";
    } else {
        $pass = password_hash($data['password'], PASSWORD_DEFAULT);
        $sql = "INSERT INTO users (club_id, username, email, role, password) VALUES (1, '$name', '$email', '$role', '$pass')";
    }
} else {
    if ($id) {
        $sql = "UPDATE members SET name='$name', role='$role' WHERE member_id=$id";
    } else {
        $sql = "INSERT INTO members (club_id, name, role) VALUES (1, '$name', '$role')";
    }
}

if ($connection->query($sql)) echo json_encode(["success" => true]);
else echo json_encode(["success" => false, "message" => $connection->error]);