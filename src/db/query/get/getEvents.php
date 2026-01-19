<?php
include "../../src/db.php";



function allEvents()
{
$eventsQuery = "Select p.title, c.name, p.title, p.content, p.image, p.created_at
              From posts as p, clubs as c
              Where p.club_id = c.club_id";
              exeEventQuery();
}

function getEventsbyDate($date)
{
    $eventsQuery = $eventsQuery + "AND p.created_at = $date"; 
}

function exeEventQuery()
{
$events = query($connection, $postsQuery);
}

?>