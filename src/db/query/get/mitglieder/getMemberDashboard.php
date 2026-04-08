<?php
header('Content-Type: application/json');
include '../../../db.php'; 

$club_id = 1;

try {
    // 1. Vereins-Infos
    $club_res = mysqli_query($connection, "SELECT name, logo FROM clubs WHERE club_id = $club_id");
    $club = mysqli_fetch_assoc($club_res);

    // 2. Nächste 5 Termine (Live-Filter: Nur zukünftige)
    $events = [];
    $sql_events = "SELECT title, event_date, location, description 
                   FROM events 
                   WHERE club_id = $club_id AND event_date >= CURDATE() 
                   ORDER BY event_date ASC LIMIT 5";
    $res_events = mysqli_query($connection, $sql_events);
    while($row = mysqli_fetch_assoc($res_events)) {
        $events[] = $row;
    }

    // 3. Die 3 aktuellsten News
    $news = [];
    $sql_news = "SELECT title, content, created_at, image 
                 FROM posts 
                 WHERE club_id = $club_id 
                 ORDER BY created_at DESC LIMIT 3";
    $res_news = mysqli_query($connection, $sql_news);
    while($row = mysqli_fetch_assoc($res_news)) {
        $news[] = $row;
    }

    // 4. Alle Mitglieder (Team-Liste)
    $members = [];
    $sql_members = "SELECT name, role, picture, description 
                    FROM members 
                    WHERE club_id = $club_id 
                    ORDER BY name ASC";
    $res_members = mysqli_query($connection, $sql_members);
    while($row = mysqli_fetch_assoc($res_members)) {
        $members[] = $row;
    }

    echo json_encode([
        "club" => $club,
        "events" => $events,
        "news" => $news,
        "members" => $members
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>