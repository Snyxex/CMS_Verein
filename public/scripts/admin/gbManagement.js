async function loadGuestbook() {
    const tableBody = document.getElementById("gbTableBody");
    try {
        const response = await fetch('/CMS_Verein/src/db/query/get/admin/getGuestbook.php');
        const data = await response.json();
        
        window.gbData = data; // Für die Suche zwischenspeichern
        renderGBTable(data);
    } catch (error) {
        console.error("Fehler beim Laden:", error);
    }
}

function renderGBTable(data) {
    const tableBody = document.getElementById("gbTableBody");
    if (!tableBody) return;

    tableBody.innerHTML = data.map(entry => `
        <tr>
            <td data-label="Datum"><small>${entry.date_formatted}</small></td>
            <td data-label="Name"><strong>${entry.name}</strong></td>
            <td data-label="Nachricht" style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
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

// GLOBAL: Löschfunktion
async function handleDeleteEntry(id) {
    if (!confirm("Soll dieser Gästebuch-Eintrag wirklich gelöscht werden?")) return;

    try {
        const response = await fetch('/CMS_Verein/src/db/query/post/admin/deleteGb.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'Guestbook', id: id })
        });
        
        const result = await response.json();
        if (result.success) {
            loadGuestbook(); // Liste neu laden
        } else {
            alert("Fehler beim Löschen");
        }
    } catch (err) {
        console.error(err);
    }
}

// Suche & Initialisierung
document.addEventListener("DOMContentLoaded", () => {
    loadGuestbook();

    const searchInput = document.getElementById("gbSearch");
    if (searchInput) {
        searchInput.oninput = (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = window.gbData.filter(item => 
                item.name.toLowerCase().includes(term) || 
                item.message.toLowerCase().includes(term)
            );
            renderGBTable(filtered);
        };
    }
});