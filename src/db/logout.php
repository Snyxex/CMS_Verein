<?php
    session_start();

    //session beenden
    session_unset();
    session_destroy();
    //reply
    echo json_encode(["status" => "success", "message" => "Logged out"]);
?>