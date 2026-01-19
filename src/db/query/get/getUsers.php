<?php
include "../../src/db.php";

function getexistinUsers()
{
    $uEmail = $_POST['email'];
    $uPassword = $_POST['password'];
    $userQuery = "Select user_id, role 
                  From users 
                  Where email = $uEmail
                  AND password = $uPassword;"; 
    exeUserQuery()
}

function getRegistrate()
{
    //$userQuery = "Select email, user_id, password, club_id From users"; 
    exeUserQuery()
}

function exeUserQuery()
{
    $users = query($connection, $userQuery);
}

?>