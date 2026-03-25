<?php
session_start();
header('Content-Type: application/json');

//reply to the site
if (isset($_SESSION['user_id'])) {
    echo json_encode(["loggedin" => true, "user_id" => $_SESSION['user_id']]);
} else {
    echo json_encode(["loggedin" => false]);
}

?>

<!--
async function isloggedin(){

const res = await fetch('check_session.php');
const data = await res.json();
return data.loggedin;
}

async function logout(){

const res = await fetch('logout.php');
const data = await res.json();
}
-->