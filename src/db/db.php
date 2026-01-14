<?php
$host='127.0.0.1';
$user='root';
$pass='';       //password
$db='cms';

    try {
       $connection = mysqli_connect($host, $user, $pass, $db);
        
    }catch (Exception $e){
        die("Error:" . $e->getMessage());
    }
    

function close($connection){
    mysqli_close($connection);
}

function query($connection, $sql){
    $result = mysqli_query($connection, $sql);
    return $result;
}

?>