<?php
header('Content-Type: application/json');
include '../../../db.php';

$data = json_decode(file_get_contents("php://input"), true);
$club_id = 1;

$post_id = !empty($data['post_id']) ? (int)$data['post_id'] : null;
$title = mysqli_real_escape_string($connection, $data['title']);
$content = mysqli_real_escape_string($connection, $data['content']);
$image = mysqli_real_escape_string($connection, $data['image']);

if ($post_id) {
    // UPDATE bestehender Post
    $sql = "UPDATE posts SET title='$title', content='$content', image='$image' 
            WHERE post_id=$post_id AND club_id=$club_id";
} else {
    // INSERT neuer Post
    $sql = "INSERT INTO posts (club_id, title, content, image) 
            VALUES ($club_id, '$title', '$content', '$image')";
}

if (mysqli_query($connection, $sql)) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => mysqli_error($connection)]);
}
mysqli_close($connection);