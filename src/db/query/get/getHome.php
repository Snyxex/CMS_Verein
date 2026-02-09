<?php
header('Content-Type: application/json');
include '../../db.php'; 

try{

    close($connection);
}catch (Exception $e){
 http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}


?>