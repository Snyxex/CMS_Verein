<?php
include "../get/getUsers.php";


getExistinUsers();

if($users == false){

    echo "klappt";
}

?>