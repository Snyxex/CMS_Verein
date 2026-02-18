<?php
include "../get/getUsers.php";


    //if($Server['REQUEST_METHOD'] == "POST")
    {
        $user = getExistinUsers($connection);
        $row = $user->fetch_assoc();

        if($row["user_id"] != "" || $row["email"] != "")
        {
            $_SESSION['clubid'] = $row['club_id'];
            $_SESSION['loggedin'] = true;
            $_SESSION['username'] = $row["username"];
            
            login();
        }
        else
        {
            echo "Falscher Benutzername oder Passwort";
        }
    }    
?>