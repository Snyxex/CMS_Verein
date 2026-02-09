<?php
// Fehleranzeige einschalten (hilft beim Debuggen)
error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../../db.php';  

// Offset-Wert sicher holen
$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;
if ($offset < 0) $offset = 0;

if (!$connection) {
    die("Verbindung fehlgeschlagen: " . mysqli_connect_error());
}

// SQL angepasst: 'datum' wurde durch 'created_at' ersetzt, da 'datum' nicht existiert
$sql = "SELECT * FROM posts ORDER BY created_at DESC LIMIT 5 OFFSET $offset";
$result = query($connection, $sql);

if ($result && $result->num_rows > 0) {
    echo '<div class="maintable">';
    echo "<table border='1'>";
    
    // Header angepasst an deine tatsächliche SQL-Tabelle
    echo "<tr>
            <th>ID</th>
            <th>Titel</th>
            <th>Inhalt</th>
            <th>Bild</th>
            <th>Datum</th>
          </tr>";

    while ($row = $result->fetch_assoc()) {
        // Wir nutzen 'created_at', da dies der Name in deiner SQL-Tabelle ist
        $datum_formatiert = date("d.m.Y H:i", strtotime($row["created_at"]));

        echo "<tr>
                <td>" . htmlspecialchars($row["post_id"]) . "</td>
                <td>" . htmlspecialchars($row["title"]) . "</td>
                <td>" . htmlspecialchars($row["content"]) . "</td>
                <td>" . htmlspecialchars($row["image"] ?? 'Kein Bild') . "</td>
                <td>" . $datum_formatiert . " Uhr</td>
              </tr>";
    }

    echo "</table>";
    echo '</div>';
} else {
    echo "<p>Keine weiteren Beiträge gefunden.</p>";
}

// Pagination Logik
$nextOffset = $offset + 5;
$prevOffset = $offset - 5;

if ($offset > 0) {
    echo '<button onclick="loadMore(' . $prevOffset . ')">Vorherige Seite</button> ';
}

// Prüfen, ob noch mehr Daten kommen könnten
if ($result && $result->num_rows == 5) {
    echo '<button onclick="loadMore(' . $nextOffset . ')">Nächste Seite</button>';
}
?>

<script>
function loadMore(offset) {
    // Falls deine Datei nicht 'seetable.php' heißt, musst du den Namen hier anpassen!
    window.location.href = 'seetable.php?offset=' + offset;
}
<<<<<<< Updated upstream
</script>
=======
</script>


>>>>>>> Stashed changes
