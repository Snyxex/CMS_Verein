<?php
include "../../db.php";

function getExistinUsers()
{
    $uEmail = $_POST['email'];
    $uPassword = $_POST['password'];
    $userQuery = "Select user_id, role 
                  From users 
                  Where email = $uEmail
                  AND password = $uPassword;"; 
    exeUserQuery();
}

function exeUserQuery()
{
    $users = query($connection, $userQuery);
}

?>