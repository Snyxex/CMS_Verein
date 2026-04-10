/**
 * Gästebuch-Moderation (Admin)
 * Ermöglicht das Überwachen und Löschen von Einträgen.
 */

// Globaler Speicher für alle Einträge, um die Filterung ohne Server-Anfragen zu ermöglichen
let allGbEntries = [];

/**
 * Lädt alle Gästebucheinträge vom Server
 */
async function loadGuestbook() {
    try {
        const response = await fetch('/CMS_Verein/src/db/query/get/admin/getGuestbook.php');
        allGbEntries = await response.json();
        
        // Nach dem Laden sofort die Anzeige mit Standardfiltern erstellen
        applyGbFilters();
    } catch (error) {
        console.error("Fehler beim Laden:", error);
    }
}

/**
 * Filtert und sortiert die Einträge basierend auf den Admin-Eingaben
 */
function applyGbFilters() {
    const searchTerm = document.getElementById("gbSearch").value.toLowerCase();
    const monthFilter = document.getElementById("gbFilterMonth").value;
    const sortOrder = document.getElementById("gbSortOrder").value;

    let filtered = allGbEntries.filter(entry => {
        // 1. Suche: Prüft, ob der Suchbegriff im Namen oder in der Nachricht vorkommt
        const matchesSearch = entry.name.toLowerCase().includes(searchTerm) || 
                              entry.message.toLowerCase().includes(searchTerm);
        
        // 2. Zeit-Filter: Vergleicht den Monat des Eintrags mit dem Filter-Dropdown
        const entryDate = new Date(entry.created_at);
        const matchesMonth = (monthFilter === "all") || 
                             (entryDate.getMonth().toString() === monthFilter);

        return matchesSearch && matchesMonth;
    });

    // 3. Sortierung: Datum absteigend (neueste zuerst) oder aufsteigend
    filtered.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    renderGBTable(filtered); // Gefilterte Daten an die Tabelle übergeben
}

/**
 * Erzeugt das HTML für die Tabellenzeilen
 * @param {Array} data - Die Liste der anzuzeigenden Einträge
 */
function renderGBTable(data) {
    const tableBody = document.getElementById("gbTableBody");
    if (!tableBody) return;

    // Falls die Filterung kein Ergebnis liefert
    if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:30px; color:var(--text-muted);">Keine Einträge gefunden.</td></tr>`;
        return;
    }

    // Erstellt für jeden Eintrag eine Tabellenzeile
    tableBody.innerHTML = data.map(entry => `
        <tr>
            <td data-label="Datum"><small>${entry.date_formatted}</small></td>
            <td data-label="Name"><strong>${entry.name}</strong></td>
            <td data-label="Nachricht" title="${entry.message}" style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                ${entry.message}
            </td>
            <td class="actions-cell">
                <button onclick="handleDeleteEntry(${entry.id})" class="delete-btn" title="Löschen">
                    🗑️ Löschen
                </button>
            </td>
        </tr>
    `).join('');
}

/**
 * Löscht einen Gästebucheintrag nach Bestätigung durch den Admin
 * @param {number} id - Die ID des zu löschenden Beitrags
 */
async function handleDeleteEntry(id) {
    if (!confirm("Soll dieser Gästebuch-Eintrag wirklich gelöscht werden?")) return;

    try {
        const response = await fetch('/CMS_Verein/src/db/query/post/admin/deleteGb.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        });
        
        const result = await response.json();
        if (result.success) {
            // Nach Erfolg Liste neu laden, um den gelöschten Eintrag zu entfernen
            loadGuestbook(); 
        } else {
            alert("Fehler beim Löschen");
        }
    } catch (err) {
        console.error("Löschfehler:", err);
    }
}

/**
 * Initialisierung beim Start der Seite
 */
document.addEventListener("DOMContentLoaded", () => {
    loadGuestbook(); // Erste Datenladung

    // Event-Listener für alle Filter-Felder registrieren
    // 'input' reagiert sofort beim Tippen oder Ändern der Auswahl
    ["gbSearch", "gbFilterMonth", "gbSortOrder"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("input", applyGbFilters);
    });
});