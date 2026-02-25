/**
 * GLOBALE FUNKTIONEN
 * Diese müssen außerhalb von DOMContentLoaded stehen, 
 * damit die onclick-Attribute im HTML darauf zugreifen können.
 */

// Modal schließen
function closeModal() {
    const modal = document.getElementById("userModal");
    if (modal) modal.classList.remove("active");
}

// Bearbeiten-Modus vorbereiten
function handleEdit(type, id, encodedData) {
    const item = JSON.parse(decodeURIComponent(encodedData));
    const modal = document.getElementById("userModal");
    
    if (!modal) return;

    // Titel und IDs setzen
    document.getElementById("modalTitle").innerText = `${type} bearbeiten`;
    document.getElementById("entityId").value = id;
    
    // Typ-Auswahl setzen und sperren (Typ-Änderung verhindert Inkonsistenz)
    const typeSelect = document.getElementById("typeSelect");
    typeSelect.value = type;
    typeSelect.disabled = true; 
    
    // Felder mit bestehenden Daten füllen
    document.getElementById("inputName").value = item.name || '';
    document.getElementById("inputEmail").value = (item.email && item.email !== 'N/A') ? item.email : '';
    document.getElementById("inputRole").value = item.role || '';
    
    // Passwort-Feld beim Editieren leeren (nur füllen, wenn es geändert werden soll)
    document.getElementById("inputPassword").value = ""; 

    modal.classList.add("active");
}

// Löschen-Funktion
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
            // Tabelle neu laden ohne Refresh
            window.location.reload(); 
        } else {
            alert("Fehler beim Löschen: " + result.message);
        }
    } catch (err) {
        console.error("Löschfehler:", err);
    }
}


/**
 * INITIALISIERUNG BEIM LADEN DER SEITE
 */
document.addEventListener("DOMContentLoaded", () => {
    const memberTableBody = document.getElementById("memberTableBody");
    const memberSearch = document.getElementById("memberSearch");
    const userForm = document.getElementById("userForm");
    const openModalBtn = document.getElementById("openModal");
    
    let allData = []; // Buffer für die Suche

    // 1. DATEN VOM SERVER LADEN
    async function loadUserManagement() {
        try {
            const response = await fetch('/CMS_Verein/src/db/query/get/admin/getMembers.php');
            if (!response.ok) throw new Error("Server-Fehler beim Laden");
            
            allData = await response.json();
            renderTable(allData);
        } catch (error) {
            console.error("Ladefehler:", error);
            if(memberTableBody) {
                memberTableBody.innerHTML = `<tr><td colspan="5" style="color:red; text-align:center;">Daten konnten nicht geladen werden.</td></tr>`;
            }
        }
    }

    // 2. TABELLE IM HTML RENDERN
    function renderTable(data) {
        if (!memberTableBody) return;
        if (data.length === 0) {
            memberTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px;">Keine Benutzer gefunden.</td></tr>`;
            return;
        }

        // Ausschnitt aus deiner memberManagement.js
memberTableBody.innerHTML = data.map(item => `
    <tr>
        <td data-label="Name">
            <span class="type-indicator ${item.type === 'Admin' ? 'is-admin' : 'is-member'}"></span>
            <strong>${item.name}</strong>
        </td>
        <td data-label="E-Mail" class="text-muted">${item.email !== 'N/A' ? item.email : '<em>keine</em>'}</td>
        <td data-label="Rolle"><span class="role-badge">${item.role || 'Standard'}</span></td>
        <td data-label="Typ"><small>${item.type}</small></td>
        <td class="actions-cell">
            <button onclick="handleEdit('${item.type}', ${item.id}, '${encodeURIComponent(JSON.stringify(item))}')" class="edit-btn">✏️</button>
            <button onclick="handleDelete('${item.type}', ${item.id})" class="delete-btn">🗑️</button>
        </td>
    </tr>
`).join('');
    }

    // 3. SUCHE-LOGIK
    if (memberSearch) {
        memberSearch.addEventListener("input", (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = allData.filter(item => 
                item.name.toLowerCase().includes(term) || 
                (item.email && item.email.toLowerCase().includes(term)) ||
                (item.role && item.role.toLowerCase().includes(term))
            );
            renderTable(filtered);
        });
    }

    // 4. SPEICHERN (SUBMIT-HANDLER)
    if (userForm) {
        userForm.onsubmit = async (e) => {
            e.preventDefault();

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
                    loadUserManagement(); // Liste aktualisieren
                } else {
                    alert("Speicherfehler: " + result.message);
                }
            } catch (err) {
                console.error("Verbindung zum Server fehlgeschlagen:", err);
            }
        };
    }

    // 5. MODAL FÜR NEUEN EINTRAG ÖFFNEN
    if (openModalBtn) {
        openModalBtn.onclick = () => {
            if (userForm) userForm.reset();
            document.getElementById("entityId").value = "";
            document.getElementById("modalTitle").innerText = "Neuer Eintrag";
            
            const typeSelect = document.getElementById("typeSelect");
            if(typeSelect) typeSelect.disabled = false;
            
            document.getElementById("userModal").classList.add("active");
        };
    }

    // Initialer Start
    loadUserManagement();
});