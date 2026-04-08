<?php
    session_start();

    //session beenden
    session_unset();                //alle Variablen werden leer gesetzt
    session_destroy();              //Session wird zerstört
    //reply
    echo json_encode(["status" => "success", "message" => "Logged out"]); 
?>