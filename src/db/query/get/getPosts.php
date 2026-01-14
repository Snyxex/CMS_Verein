<?php
include "../../src/db.php";




$postsQuery = "Select p.title, c.name, p.title, p.content, p.image, p.created_at
              From posts as p, clubs as c
              Where p.club_id = c.club_id";

$posts = query($connection, $postsQuery);


/*if($dbconnection && $posts != false)
{

    echo "<table>";

    while($row = $posts->fetch_assoc())
    {
        echo "<td>"
            .$row["title"].
            "</td>";
        echo "<td>"
            .$row["content"].
            "</td>";
        echo "<td>"
            .$row["image"].
            "</td>";
    }

    echo "</table";
}*/

?>
