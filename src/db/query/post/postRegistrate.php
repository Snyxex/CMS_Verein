<?php
include "../get/getUsers.php";



$user = getUser($connection);

    $row = $user->fetch_assoc();

    if(!$row)     //Abfrage ob der Eintag existiert
    {

        if($row["email"] == "" || $row["password"] == "")
        {
            InsertUser($connection);
        }
        else
        {
            echo "Nutzer existiert schon";
        }
    }
?>