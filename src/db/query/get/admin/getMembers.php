<?php
header('Content-Type: application/json');
include '../../../db.php'; 

// Wir nehmen an, die club_id kommt aus der Session oder ist 1
$club_id = 1; 

$sql = "

    SELECT 
        user_id AS id, 
        username AS name, 
        email, 
        role, 
        'Admin' AS type 
    FROM users 
    WHERE club_id = $club_id

    UNION ALL

    SELECT 
        member_id AS id, 
        name, 
        'N/A' AS email, -- Da 'members' keine Email hat, füllen wir es auf
        role, 
        'Mitglied' AS type 
    FROM members 
    WHERE club_id = $club_id
    
    ORDER BY name ASC";

$result = mysqli_query($connection, $sql);
$allUsers = [];

while($row = mysqli_fetch_assoc($result)) {
    $allUsers[] = $row;
}

echo json_encode($allUsers);
mysqli_close($connection);
?>