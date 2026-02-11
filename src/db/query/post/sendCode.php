<?php 
include "../get/getUsers.php";

$Uemail = $_POST['email'];
$user = checkUser($connection);

$header = "From: CMS_Verein@ \r\n" .
          "Reply-To: $Uemail \r\n" .         
          "X-Mailer: PHP/" . phpversion();

if(mail($Uemail,"test","test",$header))
{
    echo "Email sent";
}


?>