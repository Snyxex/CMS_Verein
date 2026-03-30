let allEvents = [];

/**
 * Lädt alle Events vom Server
 */
async function loadEvents() {
    try {
        const response = await fetch('/CMS_Verein/src/db/query/get/admin/getEvent.php');
        allEvents = await response.json();
        applyEventFilters();
    } catch (error) {
        console.error("Fehler beim Laden:", error);
    }
}

/**
 * Filtert und sortiert die Events
 */
function applyEventFilters() {
    const searchTerm = document.getElementById("eventSearch").value.toLowerCase();
    const monthFilter = document.getElementById("eventFilterMonth").value;
    const sortOrder = document.getElementById("eventSortOrder").value;

    let filtered = allEvents.filter(ev => {
        const matchesSearch = ev.title.toLowerCase().includes(searchTerm) || 
                              (ev.location && ev.location.toLowerCase().includes(searchTerm));
        
        const evDate = new Date(ev.event_date);
        const matchesMonth = (monthFilter === "all") || 
                             (evDate.getMonth().toString() === monthFilter);

        return matchesSearch && matchesMonth;
    });

    // Sortierung
    filtered.sort((a, b) => {
        const dateA = new Date(a.event_date);
        const dateB = new Date(b.event_date);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    renderEventTable(filtered);
}

/**
 * Erzeugt das HTML für die Tabelle
 */
function renderEventTable(data) {
    const tableBody = document.getElementById("eventTableBody");
    if (!tableBody) return;

    if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:30px; color:var(--text-muted);">Keine Termine gefunden.</td></tr>`;
        return;
    }

    tableBody.innerHTML = data.map(ev => `
        <tr>
            <td data-label="Datum"><strong>${new Date(ev.event_date).toLocaleDateString('de-DE')}</strong></td>
            <td data-label="Event">${ev.title}</td>
            <td data-label="Ort">${ev.location || 'n.A.'}</td>
            <td class="actions-cell">
                <button onclick="handleEditEvent('${encodeURIComponent(JSON.stringify(ev))}')" class="edit-btn">✏️</button>
                <button onclick="handleDeleteEvent(${ev.event_id})" class="delete-btn">🗑️</button>
            </td>
        </tr>
    `).join('');
}

// Initialisierung & Event Listener
document.addEventListener("DOMContentLoaded", () => {
    loadEvents();

    const modal = document.getElementById("eventModal");
    const form = document.getElementById("eventForm");

    // Modal öffnen
    document.getElementById("openEventModal").onclick = () => {
        form.reset();
        document.getElementById("eventId").value = "";
        document.getElementById("modalTitle").innerText = "Neuer Termin";
        modal.classList.add("active");
    };

    // Filter-Events
    ["eventSearch", "eventFilterMonth", "eventSortOrder"].forEach(id => {
        document.getElementById(id).addEventListener("input", applyEventFilters);
    });

    // Formular absenden
    form.onsubmit = async (e) => {
        e.preventDefault();
        const formData = {
            id: document.getElementById("eventId").value,
            title: document.getElementById("eventTitle").value,
            date: document.getElementById("eventDate").value,
            location: document.getElementById("eventLocation").value,
            street: document.getElementById("eventStreet").value,
            zip: document.getElementById("eventZip").value,
            description: document.getElementById("eventDescription").value
        };

        const res = await fetch('/CMS_Verein/src/db/query/post/admin/saveEvent.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        });
        
        const result = await res.json();
        if (result.success) {
            closeEventModal();
            loadEvents();
        } else {
            alert("Fehler beim Speichern!");
        }
    };
});

// Diese Funktionen müssen global (window) verfügbar sein für die onclick-Attribute
window.handleEditEvent = function(encoded) {
    const ev = JSON.parse(decodeURIComponent(encoded));
    document.getElementById("eventId").value = ev.event_id;
    document.getElementById("eventTitle").value = ev.title;
    document.getElementById("eventDate").value = ev.event_date;
    document.getElementById("eventLocation").value = ev.location;
    document.getElementById("eventStreet").value = ev.street;
    document.getElementById("eventZip").value = ev.zip;
    document.getElementById("eventDescription").value = ev.description;
    
    document.getElementById("modalTitle").innerText = "Termin bearbeiten";
    document.getElementById("eventModal").classList.add("active");
};

window.closeEventModal = function() {
    document.getElementById("eventModal").classList.remove("active");
};

window.handleDeleteEvent = async function(id) {
    if(!confirm("Termin wirklich löschen?")) return;
    const res = await fetch('/CMS_Verein/src/db/query/post/admin/deleteEvent.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id})
    });
    if((await res.json()).success) {
        loadEvents();
    }
};