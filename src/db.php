<?php
$host='127.0.0.1';
$user='root';
$pass='';       //password
$db='cms';


function start(){                       //Besprechen wie es eingesetzt werden soll/kann
    try {
       $connection = connect($host, $user, $pass, $db);
        
    }catch (Exception $e){
        die("Error:" . e->getMessage());
    }
    
}


function connect($host, $user, $pass, $db){         //Variablen sind nur durch ÜBergabe bekannt??

$connection = mysqli_connect($host, $user, $pass, $db);
return $connection;
}

function close($connection){
    mysqli_close($connection);
}

function query($connection, $sql){
    $result = mysqli_query($connection, $sql);
    return $result;
}

?>