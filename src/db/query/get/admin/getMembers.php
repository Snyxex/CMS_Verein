<?php
header('Content-Type: application/json');
include '../../../db.php'; 

$sql = "SELECT id, firstname, lastname, email, status, joined_at FROM members ORDER BY lastname ASC";
$result = mysqli_query($connection, $sql);

$members = [];
while($row = mysqli_fetch_assoc($result)) {
    $members[] = $row;
}

echo json_encode($members);
mysqli_close($connection);
?>