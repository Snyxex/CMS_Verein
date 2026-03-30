async function loadEvents() {
    const response = await fetch('/CMS_Verein/src/db/query/get/admin/getEvent.php'); // Erstelle analog zu getMembers
    const data = await response.json();
    const tableBody = document.getElementById("eventTableBody");
    
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

document.addEventListener("DOMContentLoaded", () => {
    loadEvents();
    const modal = document.getElementById("eventModal");
    const form = document.getElementById("eventForm");

    document.getElementById("openEventModal").onclick = () => {
        form.reset();
        document.getElementById("eventId").value = "";
        document.getElementById("modalTitle").innerText = "Neuer Termin";
        modal.classList.add("active");
    };

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

        const res = await fetch('/CMS_Verein/src/db/query/get/admin/saveEvent.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        });
        
        if ((await res.json()).success) {
            closeEventModal();
            loadEvents();
        }
    };
});

function handleEditEvent(encoded) {
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
}

function closeEventModal() {
    document.getElementById("eventModal").classList.remove("active");
}

async function handleDeleteEvent(id) {
    if(!confirm("Termin wirklich löschen?")) return;
    await fetch('/CMS_Verein/src/db/query/post/admin/deleteEvent.php', { // Erstelle separate Datei
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id})
    });
    loadEvents();
}