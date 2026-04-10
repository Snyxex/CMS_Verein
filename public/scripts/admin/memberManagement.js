/**
 * Diese Funktionen stehen außerhalb des DOMContentLoaded, damit sie 
 * direkt über das 'onclick'-Attribut im HTML aufgerufen werden können.
 */

// Schließt das Bearbeitungs-Fenster (Modal)
function closeModal() {
    const modal = document.getElementById("userModal");
    if (modal) modal.classList.remove("active");
}

/**
 * Bereitet das Modal für das Bearbeiten eines Nutzers vor
 * @param {string} type - Entweder 'Admin' oder 'Member'
 * @param {number} id - Die ID aus der jeweiligen Datenbank-Tabelle
 * @param {string} encodedData - Das komplette Objekt als verschlüsselter JSON-String
 */
function handleEdit(type, id, encodedData) {
    const item = JSON.parse(decodeURIComponent(encodedData));
    const modal = document.getElementById("userModal");
    
    if (!modal) return;

    // Modal-Felder mit den existierenden Daten füllen
    document.getElementById("modalTitle").innerText = `${type} bearbeiten`;
    document.getElementById("entityId").value = id;
    
    const typeSelect = document.getElementById("typeSelect");
    typeSelect.value = type;
    typeSelect.disabled = true; // Der Typ (Admin/Mitglied) darf beim Editieren nicht geändert werden
    
    document.getElementById("inputName").value = item.name || '';
    // E-Mail nur einsetzen, wenn sie nicht 'N/A' (Not Available) ist
    document.getElementById("inputEmail").value = (item.email && item.email !== 'N/A') ? item.email : '';
    document.getElementById("inputRole").value = item.role || '';
    document.getElementById("inputPassword").value = ""; // Passwort-Feld aus Sicherheitsgründen immer leer starten

    modal.classList.add("active");
}

/**
 * Löscht einen Nutzer nach einer Bestätigungsabfrage
 */
async function handleDelete(type, id) {
    if (!confirm(`Möchtest du diesen ${type === 'Admin' ? 'Administrator' : 'Mitglied'} wirklich löschen?`)) return;

    try {
        const response = await fetch('/CMS_Verein/src/db/query/post/admin/deleteUser.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, id })
        });

        const result = await response.json();
        if (result.success) {
            location.reload(); // Seite neu laden, um die Tabelle zu aktualisieren
        } else {
            alert("Fehler beim Löschen: " + result.message);
        }
    } catch (err) {
        console.error("Löschfehler:", err);
    }
}


/**
 * INITIALISIERUNG BEIM LADEN DER SEITE
 * Hier wird die Tabelle befüllt und die Filter-Logik aktiviert.
 */
document.addEventListener("DOMContentLoaded", () => {
    const memberTableBody = document.getElementById("memberTableBody");
    const memberSearch = document.getElementById("memberSearch");
    const typeFilter = document.getElementById("typeFilter"); 
    const userForm = document.getElementById("userForm");
    const openModalBtn = document.getElementById("openModal");
    
    let allData = []; // Zwischenspeicher für alle Nutzer (für die Suche ohne Server-Anfrage)

    // 1. DATEN LADEN: Holt Admins und Mitglieder kombiniert vom Server
    async function loadUserManagement() {
        try {
            const response = await fetch('/CMS_Verein/src/db/query/get/admin/getMembers.php');
            if (!response.ok) throw new Error("Server-Fehler");
            
            allData = await response.json();
            renderTable(allData);
        } catch (error) {
            console.error("Ladefehler:", error);
            if(memberTableBody) {
                memberTableBody.innerHTML = `<tr><td colspan="5" style="color:red; text-align:center;">Fehler beim Laden der Daten.</td></tr>`;
            }
        }
    }

    // 2. TABELLE RENDERN: Erzeugt die HTML-Zeilen basierend auf den Daten
    function renderTable(data) {
        if (!memberTableBody) return;
        
        if (data.length === 0) {
            memberTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px;">Keine Einträge gefunden.</td></tr>`;
            return;
        }

        memberTableBody.innerHTML = data.map(item => `
            <tr>
                <td data-label="Name"><strong>${item.name}</strong></td>
                <td data-label="E-Mail">
                    ${item.email !== 'N/A' ? item.email : '<span class="text-muted">keine</span>'}
                </td>
                <td data-label="Rolle">
                    <span class="role-badge">${item.role || 'Standard'}</span>
                </td>
                <td data-label="Typ"><small>${item.type}</small></td>
                <td class="actions-cell" style="text-align: right;">
                    <button onclick="handleEdit('${item.type}', ${item.id}, '${encodeURIComponent(JSON.stringify(item))}')" class="edit-btn" title="Bearbeiten">✏️</button>
                    <button onclick="handleDelete('${item.type}', ${item.id})" class="delete-btn" title="Löschen">🗑️</button>
                </td>
            </tr>
        `).join('');
    }

    // 3. FILTER-LOGIK: Kombiniert Textsuche und Typ-Auswahl (Admin/Mitglied)
    function applyFilters() {
        const searchTerm = memberSearch ? memberSearch.value.toLowerCase() : "";
        const typeTerm = typeFilter ? typeFilter.value : "all";

        const filtered = allData.filter(item => {
            // Checkt, ob Suchbegriff in Name, Email oder Rolle vorkommt
            const matchesSearch = 
                item.name.toLowerCase().includes(searchTerm) || 
                (item.email && item.email.toLowerCase().includes(searchTerm)) ||
                (item.role && item.role.toLowerCase().includes(searchTerm));

            // Checkt, ob der Typ (Admin/Member) mit dem Dropdown übereinstimmt
            const matchesType = (typeTerm === "all" || item.type === typeTerm);

            return matchesSearch && matchesType;
        });

        renderTable(filtered); // Nur gefilterte Daten anzeigen
    }

    // Event-Listener: Reagieren sofort auf Eingaben
    if (memberSearch) memberSearch.addEventListener("input", applyFilters);
    if (typeFilter) typeFilter.addEventListener("change", applyFilters);

    // 4. SPEICHERN (ERSTELLEN & UPDATEN)
    if (userForm) {
        userForm.onsubmit = async (e) => {
            e.preventDefault(); // Standard-Formularversand unterdrücken

            const formData = {
                id: document.getElementById("entityId").value,
                type: document.getElementById("typeSelect").value,
                name: document.getElementById("inputName").value,
                email: document.getElementById("inputEmail").value,
                role: document.getElementById("inputRole").value,
                password: document.getElementById("inputPassword").value
            };

            try {
                const response = await fetch('/CMS_Verein/src/db/query/post/admin/saveUser.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();
                if (result.success) {
                    closeModal();
                    loadUserManagement(); // Liste aktualisieren ohne Neuladen der Seite
                } else {
                    alert("Fehler: " + result.message);
                }
            } catch (err) {
                console.error("Serverfehler:", err);
            }
        };
    }

    // 5. NEU-MODAL ÖFFNEN: Formular für einen leeren Eintrag vorbereiten
    if (openModalBtn) {
        openModalBtn.onclick = () => {
            userForm.reset();
            document.getElementById("entityId").value = ""; // Keine ID = Neuer Eintrag
            document.getElementById("modalTitle").innerText = "Neuer Eintrag";
            document.getElementById("typeSelect").disabled = false; // Typ-Wahl erlauben
            document.getElementById("userModal").classList.add("active");
        };
    }

    // Initialer Start beim Seitenaufruf
    loadUserManagement();
});