<?php
header('Content-Type: application/json');
include '../../db.php'; 

try {
    // Club Daten
    $sql_club = "SELECT name, description, logo FROM clubs LIMIT 1";
    $club = mysqli_fetch_assoc(mysqli_query($connection, $sql_club));

    // News Daten
    $news = [];
    $sql_news = "SELECT title, content, created_at FROM posts ORDER BY created_at DESC LIMIT 3";
    $res = mysqli_query($connection, $sql_news);
    while($row = mysqli_fetch_assoc($res)){
        $news[] = $row;
    }

    // Nächstes Event
    $sql_events = "SELECT title, event_date, location, description FROM events WHERE event_date >= CURDATE() ORDER BY event_date ASC LIMIT 1";
    $events = mysqli_fetch_assoc(mysqli_query($connection, $sql_events));

    // Stats - Mitglieder
    $sql_members = "SELECT COUNT(*) AS count FROM members";
    $members_res = mysqli_fetch_assoc(mysqli_query($connection, $sql_members));
    $actualMemberCount = $members_res['count']; // Variable umbenannt für Klarheit

    // Stats - Event Anzahl
    $sql_eventCount = "SELECT COUNT(*) AS count FROM events WHERE event_date >= CURDATE()";
    $eventCount_res = mysqli_fetch_assoc(mysqli_query($connection, $sql_eventCount));
    $actualEventCount = $eventCount_res['count'];

    // JSON Ausgabe
    echo json_encode([
        "club" => $club,
        "news" => $news,
        "events" => $events,
        "stats" => [
            "members" => (int)$actualMemberCount, // Hier war der Fehler ($memberCount existierte nicht)
            "events" => (int)$actualEventCount    // Hier auch auf die richtige Variable achten
        ]
    ]);

    mysqli_close($connection);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>