let allGbEntries = [];

/**
 * Lädt alle Gästebucheinträge
 */
async function loadGuestbook() {
    try {
        const response = await fetch('/CMS_Verein/src/db/query/get/admin/getGuestbook.php');
        allGbEntries = await response.json();
        applyGbFilters();
    } catch (error) {
        console.error("Fehler beim Laden:", error);
    }
}

/**
 * Wendet Filter und Sortierung an
 */
function applyGbFilters() {
    const searchTerm = document.getElementById("gbSearch").value.toLowerCase();
    const monthFilter = document.getElementById("gbFilterMonth").value;
    const sortOrder = document.getElementById("gbSortOrder").value;

    let filtered = allGbEntries.filter(entry => {
        // 1. Suche in Name und Nachricht
        const matchesSearch = entry.name.toLowerCase().includes(searchTerm) || 
                              entry.message.toLowerCase().includes(searchTerm);
        
        // 2. Monats-Filter (created_at nutzen)
        const entryDate = new Date(entry.created_at);
        const matchesMonth = (monthFilter === "all") || 
                             (entryDate.getMonth().toString() === monthFilter);

        return matchesSearch && matchesMonth;
    });

    // 3. Sortierung
    filtered.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    renderGBTable(filtered);
}

/**
 * Rendert die Tabelle
 */
function renderGBTable(data) {
    const tableBody = document.getElementById("gbTableBody");
    if (!tableBody) return;

    if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:30px; color:var(--text-muted);">Keine Einträge gefunden.</td></tr>`;
        return;
    }

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
 * Löschfunktion
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
            loadGuestbook(); // Neu laden
        } else {
            alert("Fehler beim Löschen");
        }
    } catch (err) {
        console.error(err);
    }
}

// Initialisierung
document.addEventListener("DOMContentLoaded", () => {
    loadGuestbook();

    // Event Listener für Filter
    ["gbSearch", "gbFilterMonth", "gbSortOrder"].forEach(id => {
        document.getElementById(id).addEventListener("input", applyGbFilters);
    });
});