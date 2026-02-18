<?php
include "../get/getUsers.php";

session_start();

if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
    header("Location: /CMS_Verein/public/admin/dashboard.html");
    exit;
}

   // if($Server['REQUEST_METHOD'] == "POST")
    {
        $user = getExistinUsers($connection);
        $row = $user->fetch_assoc();

        if($row["user_id"] != "" || $row["email"] != "")
        {
            $_SESSION['loggedin'] = true;
            $_SESSION['username'] = $row["username"];

            
        }
        else
        {
            echo "Falscher Benutzername oder Passwort";
        }
    }    
?>