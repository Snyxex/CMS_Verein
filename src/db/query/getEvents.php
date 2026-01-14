<?php
include "../../src/db.php";




$eventsQuery = "Select p.title, c.name, p.title, p.content, p.image, p.created_at
              From posts as p, clubs as c
              Where p.club_id = c.club_id";

$events = query($connection, $postsQuery);

?>