/**
 * Gästebuch-Logik
 * Wartet darauf, dass das HTML geladen ist, und ruft dann die Kommentare ab
 */
document.addEventListener("DOMContentLoaded", () => {
    // Das Container-Element, in dem die Kommentare angezeigt werden sollen
    const commentList = document.getElementById("commentList");

    /**
     * Holt die Kommentare vom Server und rendert sie
     */
    async function loadComments() {
        try {
            // Anfrage an das PHP-Skript senden
            const response = await fetch('/CMS_Verein/src/db/query/get/getPosts.php');
            
            // Prüfen, ob die Server-Antwort erfolgreich war
            if (!response.ok) {
                throw new Error(`HTTP-Fehler! Status: ${response.status}`);
            }

            // Die JSON-Antwort in ein JavaScript-Array umwandeln
            const data = await response.json();

            // Falls die Datenbank leer ist, einen Platzhalter-Text anzeigen
            if (data.length === 0) {
                commentList.innerHTML = "<p>Noch keine Einträge vorhanden. Sei der Erste!</p>";
                return;
            }

            /**
             * Jeden Kommentar aus dem Array in HTML umwandeln
             * c.name -> Name des Verfassers
             * c.created_at -> Datum aus der Datenbank
             * c.message -> Der eigentliche Kommentar-Text
             */
            commentList.innerHTML = data.map(c => `
                <div class="comment-entry-item" style="border-bottom: 1px solid #eee; padding: 15px; margin-bottom: 10px; background: #f9f9f9; border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between;">
                        <strong style="color: #2c3e50;">${c.name}</strong>
                        <small style="color: #888;">${new Date(c.created_at).toLocaleString('de-DE')}</small>
                    </div>
                    <p style="margin-top: 10px; color: #444;">${c.message}</p>
                </div>
            `).join(''); // Die einzelnen HTML-Blöcke zu einem langen String verbinden

        } catch (error) {
            // Fehlerbehandlung: Wenn z.B. die Datenbank nicht erreichbar ist
            console.error("Fehler beim Laden:", error);
            commentList.innerHTML = "<p style='color: red;'>Fehler beim Laden der Kommentare.</p>";
        }
    }
    
    // Die Lade-Funktion sofort ausführen
    loadComments();
});