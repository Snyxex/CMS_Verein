<?php
header('Content-Type: application/json');
include '../../db.php';


try{
$sql = "SELECT name, message, created_at FROM guestbook ORDER BY created_at DESC";

$result = query($connection, $sql); 

$comments = [];
if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $comments[] = $row;
    }
}
echo json_encode($comments);
}catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "error" => $e->getMessage()
    ]);
}

?>
