<?php
$host = '127.0.0.1'; 
$user = 'root';
$pass = ''; 
$db   = 'cms';


mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $connection = mysqli_connect($host, $user, $pass, $db);
} catch (Exception $e) {

    die("Datenbank-Verbindungsfehler: " . $e->getMessage());
}

function close($connection) {
    mysqli_close($connection);
}

function query($connection, $sql) {
    $result = mysqli_query($connection, $sql);
    return $result;
}
?>