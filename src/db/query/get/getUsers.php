<?php
include "../../db.php";

function getUser($connection)             //Funktion die die Anmeldeeingabe vergleicht 
{
    $uEmail = $_POST['email'];
    $uPassword = $_POST['password'];
    $userQuery = "Select * 
                  From users 
                  Where email = '$uEmail'
                  AND password = '$uPassword';"; 
    $user = query($connection, $userQuery);

    return $user;
    close($connection);
}

function checkUser($connection)                 //Funktion um über Email den Nutzer zu erhalten 
{
    $uEmail = $_POST['email'];
    $userQuery = "Select * 
                  From users 
                  Where email = '$uEmail'"; 
    $user = query($connection, $userQuery);

    return $user;
    close($connection);
}

function InsertUser($connection)                //Funktion die einen neuen Nutzer zu erstellt
{
    $uEmail = $_POST['email'];
    $uUsername = $_POST['username'];
    $uPassword = $_POST['password'];
    $userInsert= "
                  INSERT INTO users 
                  (club_id, username, password, email, created_at)
                  VALUES (1, '$uUsername', '$uPassword', '$uEmail', CURDATE());";
    $newUser = query($connection, $userInsert);

    close($connection);
}
?>