<?php
// Verweise auf ein Stylesheet
//echo '<link rel="stylesheet" type="text/css" href="style.css">';

// Datenbankverbindungsinformationen
   include '../../db.php';  

// Offset-Wert aus der URL holen für Seitenblätter
// Standardwert ist 0, falls kein Offset in der URL übergeben wurde
$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;        //intval Wandelt den übergebenen Offset-Wert in einen Integer. : 0 = Wenn der offset nicht existiert, wird der Standardwert 0 benutzt.


// Überprüfen, ob die Verbindung erfolgreich ist
if (!$connection) {
    // Bei einem Fehler die Verbindung abbrechen und eine Fehlermeldung ausgeben
    die("Keine Verbindung: " . mysqli_connect_error());
}

// SQL-Abfrage vorbereiten, um Beiträge aus der Tabelle abzurufen
// Die Beiträge werden nach Datum absteigend sortiert (neuesten zuerst)
// Es werden maximal 5 Beiträge abgerufen, beginnend beim Offset-Wert
$query = $connection->prepare("SELECT * FROM posts ORDER BY datum DESC LIMIT 5 OFFSET ?");
$query->bind_param("i", $offset); // Offset sicher einfügen
$query->execute(); // Abfrage ausführen
$result = $query->get_result(); // Ergebnisse abrufen

// Überprüfen, ob Ergebnisse aus der Abfrage vorhanden sind
if ($result && $result->num_rows > 0) {
    // HTML-Tabelle erstellen, um die Daten anzuzeigen
    echo '<div class="maintable">'; // Container für die Tabelle
    echo "<table>"; // Tabellenanfang
    echo "<tr><th>Vorname</th><th>Nachname</th><th>Telefonnummer</th><th>Email</th><th>Beitrag</th><th>Datum</th></tr>";

    // Jede Zeile der Ergebnisse wird in der Tabelle ausgegeben
    while ($row = $result->fetch_assoc()) {
        // Datum formatieren, um es lesbarer zu machen
        $datum = date("d.m.Y H:i:s", strtotime($row["datum"]));

        // Sicherstellen, dass alle Inhalte in HTML sicher angezeigt werden
        echo "<tr>
                <td>" . htmlspecialchars($row["title"]) . "</td>
                <td>" . htmlspecialchars($row["content"]) . "</td>
                <td>" . htmlspecialchars($row["image"]) . "</td>
                <td>" . htmlspecialchars($row["created_at"]) . "</td>
                <td>$datum</td>
              </tr>";
    }

    // Tabellenende und Schließen des Containers
    echo "</table>";
    echo '</div>';
}

// Berechnungen für die aufgeteilten Seiten
$nextOffset = $offset + 5; // Offset für die nächste Seite
$prevOffset = $offset - 5; // Offset für die vorherige Seite

// Button für die vorherige Seite anzeigen, falls der Offset gültig ist
if ($prevOffset >= 0) {
    echo '<button onclick="loadMore(' . $prevOffset . ')">Vorherige Seite</button>';
}

// Button für die nächste Seite anzeigen
echo '<button onclick="loadMore(' . $nextOffset . ')">Nächste Seite</button>';

?>
<script>
// JavaScript-Funktion zur den Seiten
// Beim Klicken eines Buttons wird die Seite mit dem neuen Offset geladen
function loadMore(offset) {
    // Neue URL mit dem Offset-Wert aufrufen 
    window.location.href = 'seetable.php?offset=' + offset;
}
</script>

<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
