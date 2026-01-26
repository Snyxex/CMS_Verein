<?php
include "../get/getUsers.php";


$userQuery = getExistinUsers($connection);

if($userQuery == false)
{
    //Insert
}
?>