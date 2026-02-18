<?php
$host = 'localhost'; 
$user = 'root';
$pass = ''; 
$db   = 'cms';

session_start();

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

function login(){
    if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
        header("Location: /CMS_Verein/public/admin/dashboard.html");
        exit;
    }
}

function endSession(){
    session_unset();
    session_destroy();
}

?>