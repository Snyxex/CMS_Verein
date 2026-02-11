<?php
include "../get/getUsers.php";


$user = getExistinUsers($connection);

    $row = $user->fetch_assoc();

        if($row["user_id"] != "" || $row["role"] != "")
        {
            header("Location: /CMS_Verein/public/admin/dashboard.html");
        }
        else
        {
            echo "Nutzer existiert nicht";
        }

?>