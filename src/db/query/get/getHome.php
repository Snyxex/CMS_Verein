<?php
header('Content-Type: application/json');
include '../../db.php'; 

try{
   $sql_club = "SELECT name, description, logo FROM clubs LIMIT 1";
   $club = mysqli_fetch_assoc(query($connection, $sql_club));

   $news = [];
   $sql_news = "SELECT title, content, created_at FROM posts 
    ORDER BY created_at DESC LIMIT 3";
   $res = query($connection,$sql_news);

  while($row = mysqli_fetch_assoc($res)){
    $news[] = $row;
  }

$sql_events = " SELECT 
                title, 
                event_date, 
                location,
                description     
            FROM events 
            WHERE event_date >= CURDATE()
            ORDER BY event_date ASC 
            LIMIT 1";
$events = mysqli_fetch_assoc(query($connection, $sql_events));


$sql_members = "SELECT COUNT(*) AS count FROM members";
$members = mysqli_fetch_assoc(query($connection, $sql_members))['count'];

$sql_eventCount = "SELECT COUNT(*) AS count FROM events WHERE event_date >= CURDATE()";
$eventCount = mysqli_fetch_assoc(query($connection, $sql_eventCount))['count'];

 
echo json_encode([
    "club" => $club,
    "news" => $news,
    "events" => $events,
    "stats" => [
        "members" => $memberCount,
        "events" => $eventCount
    ]
]);
    close($connection);
}catch (Exception $e){
 http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}


?>