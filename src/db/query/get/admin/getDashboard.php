<?php
header('Content-Type: application/json');
include '../../../db.php'; 

$club_id = 1; // Später Session

// Zähler abfragen
$m_count = mysqli_fetch_assoc(mysqli_query($connection, "SELECT COUNT(*) as c FROM members WHERE club_id=$club_id"))['c'];
$e_count = mysqli_fetch_assoc(mysqli_query($connection, "SELECT COUNT(*) as c FROM events WHERE club_id=$club_id AND event_date >= CURDATE()"))['c'];
$p_count = mysqli_fetch_assoc(mysqli_query($connection, "SELECT COUNT(*) as c FROM posts WHERE club_id=$club_id"))['c'];
$g_count = mysqli_fetch_assoc(mysqli_query($connection, "SELECT COUNT(*) as c FROM guestbook WHERE club_id=$club_id"))['c'];

// Die nächsten 5 Events
$events = [];
$res_events = mysqli_query($connection, "SELECT title, event_date, location FROM events WHERE club_id=$club_id AND event_date >= CURDATE() ORDER BY event_date ASC LIMIT 5");
while($row = mysqli_fetch_assoc($res_events)) $events[] = $row;

// Die letzten 3 Gästebuch-Einträge
$gb = [];
$res_gb = mysqli_query($connection, "SELECT name, created_at FROM guestbook WHERE club_id=$club_id ORDER BY created_at DESC LIMIT 3");
while($row = mysqli_fetch_assoc($res_gb)) {
    $row['date_formatted'] = date('d.m. H:i', strtotime($row['created_at']));
    $gb[] = $row;
}

echo json_encode([
    "counts" => [
        "members" => (int)$m_count,
        "events" => (int)$e_count,
        "posts" => (int)$p_count,
        "gb" => (int)$g_count
    ],
    "upcomingEvents" => $events,
    "recentGB" => $gb
]);
?>