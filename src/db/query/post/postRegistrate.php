<?php
include "../get/getUsers.php";



$user = getExistinUsers($connection);

    $row = $user->fetch_assoc();

        if($row["email"] == "" || $row["password"] == "")
        {
            InsertUser($connection);
        }
        else
        {
            echo "Nutzer existiert schon";
        }

?>