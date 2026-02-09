<?php

include '../../db.php'; 

if ($_SERVER["REQUEST_METHOD"] == "POST") {
   
    $name = mysqli_real_escape_string($connection, $_POST['name']);
    $message = mysqli_real_escape_string($connection, $_POST['comment']);
    $club_id = 1; 

    $sql = "INSERT INTO guestbook (club_id, name, message) VALUES ('$club_id', '$name', '$message')";

    if (mysqli_query($connection, $sql)) {
        
        header("Location: /CMS_Verein/public/guestbook.html?success=1");
        exit();
    } else {
        echo "Fehler beim Speichern: " . mysqli_error($connection);
    }
    close($connection);
}
?>