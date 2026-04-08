<?php
include "../get/getUsers.php";

        $user = getUser($connection);
        $row = $user->fetch_assoc();
        
        if($row)     //Abfrage ob der Eintag existiert
        {
            if($row["user_id"] != "" && $row["email"] != "")    //falschen Nutzereintrag ignorieren
            {
                $_SESSION['clubid'] = $row['club_id'];
                $_SESSION['loggedin'] = true;
                $_SESSION['email'] = $row["email"];
                
                header("Location: /CMS_Verein/public/admin/dashboard.html");
            }
            else
            {
                echo "Falscher Benutzername oder Passwort";
            }
        }
?>