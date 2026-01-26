<?php
include "../../db.php";

function getExistinUsers($connection)
{
    $uEmail = $_POST['email'];
    $uPassword = $_POST['password'];
    $userQuery = "Select user_id, role 
                  From users 
                  Where email = '$uEmail'
                  AND password = '$uPassword';"; 
    query($connection, $userQuery);
}

?>