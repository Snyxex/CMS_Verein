<?php
header('Content-Type: application/json');
include '../../../db.php';

$club_id = 1; // Später per Session

$sql = "SELECT post_id, title, content, image, created_at 
        FROM posts 
        WHERE club_id = $club_id 
        ORDER BY created_at DESC";

$result = mysqli_query($connection, $sql);
$posts = [];

while($row = mysqli_fetch_assoc($result)) {
    $row['date_formatted'] = date('d.m.Y', strtotime($row['created_at']));
    // Vorschau-Text erstellen (ersten 100 Zeichen)
    $row['excerpt'] = mb_strimwidth(strip_tags($row['content']), 0, 100, "...");
    $posts[] = $row;
}

echo json_encode($posts);
mysqli_close($connection);