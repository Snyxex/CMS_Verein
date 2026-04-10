/**
 * Öffentliches Mitglieder-Verzeichnis
 * Wartet auf das Laden des Dokuments und befüllt das Grid mit Mitgliederkarten
 */
document.addEventListener("DOMContentLoaded", () => {
    // Der Container (Grid), in dem die Karten erscheinen sollen
    const grid = document.getElementById("membersGrid");

    /**
     * Holt die Mitgliederdaten vom PHP-Backend
     */
    async function fetchMembers() {
        try {
            // Anfrage an das PHP-Skript senden, das die Datenbank ausliest
            const response = await fetch('/CMS_Verein/src/db/query/get/getMembersPublic.php');
            
            // Die Antwort des Servers in ein JavaScript-Array umwandeln
            const members = await response.json();

            // Falls keine Mitglieder in der Datenbank gefunden wurden
            if (members.length === 0) {
                grid.innerHTML = "<p>Aktuell sind keine Mitglieder eingetragen.</p>";
                return;
            }

            /**
             * Mapping: Jedes Mitglied im Array wird in einen HTML-Block umgewandelt.
             * m.role -> Die Funktion (z.B. Vorstand)
             * m.name -> Der Vor- und Nachname
             * m.description -> Ein kurzer Text zur Person
             */
            grid.innerHTML = members.map(m => `
                <div class="member-card">
                    <div class="member-info">
                        <span class="member-role">${m.role || 'Mitglied'}</span>
                        <h3>${m.name}</h3>
                        <p class="member-desc">${m.description || ''}</p>
                    </div>
                </div>
            `).join(''); // Verbindet alle Karten-Strings zu einem großen HTML-Block

        } catch (error) {
            // Fehlerbehandlung bei Netzwerkproblemen oder Datenbankfehlern
            console.error("Fehler:", error);
            grid.innerHTML = "<p>Fehler beim Laden der Mitglieder.</p>";
        }
    }

    // Startet den Abrufvorgang
    fetchMembers();
});