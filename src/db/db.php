<?php
$host = 'localhost'; 
$user = 'root';
$pass = ''; 
$db   = 'cms';

session_start();        //startet eine Session

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $connection = mysqli_connect($host, $user, $pass, $db); //Verbindung zur Datenbank
} catch (Exception $e) {

    die("Datenbank-Verbindungsfehler: " . $e->getMessage());
}

function close($connection) {       // schließt die Verbindung zur Datenbank    
    mysqli_close($connection);
}

function query($connection, $sql) {  // führt ein Query aus und gibt das Ergebnis zurück
    $result = mysqli_query($connection, $sql);
    return $result;
}

?>