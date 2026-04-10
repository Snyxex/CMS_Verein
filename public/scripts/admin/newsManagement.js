/**
 * News-Verwaltung für den Admin-Bereich
 * Ermöglicht das Laden, Filtern, Bearbeiten und Löschen von News-Beiträgen.
 */

// Globaler Speicher, damit wir beim Filtern nicht jedes Mal neu vom Server laden müssen
let allNews = [];

/**
 * Holt alle News-Beiträge aus der Datenbank
 */
async function loadNews() {
    try {
        const response = await fetch('/CMS_Verein/src/db/query/get/admin/getNews.php');
        const data = await response.json();
        
        if (data.error) {
            console.error("Server-Fehler:", data.error);
            return;
        }

        allNews = data; // Daten global speichern
        applyFilters(); // Anzeige initial befüllen
    } catch (e) {
        console.error("Netzwerkfehler beim Laden der News:", e);
    }
}

/**
 * Verarbeitet die Benutzereingaben (Suche, Monat, Sortierung)
 * Erstellt eine gefilterte Liste und gibt sie an die Tabelle weiter.
 */
function applyFilters() {
    const searchTerm = document.getElementById("newsSearch").value.toLowerCase();
    const monthFilter = document.getElementById("filterMonth").value;
    const sortOrder = document.getElementById("sortOrder").value;

    let filtered = allNews.filter(post => {
        // 1. Übereinstimmung in Titel oder Inhalt prüfen
        const matchesSearch = post.title.toLowerCase().includes(searchTerm) || 
                              post.content.toLowerCase().includes(searchTerm);
        
        // 2. Übereinstimmung des Erstellungsmonats prüfen
        const postDate = new Date(post.created_at);
        const matchesMonth = (monthFilter === "all") || 
                             (postDate.getMonth().toString() === monthFilter);

        return matchesSearch && matchesMonth;
    });

    // 3. Sortierung nach Datum (aufsteigend oder absteigend)
    filtered.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    renderNewsTable(filtered); // Ergebnis anzeigen
}

/**
 * Baut den HTML-Body der Tabelle zusammen
 * @param {Array} data - Die (gefilterten) News-Beiträge
 */
function renderNewsTable(data) {
    const tableBody = document.getElementById("newsTableBody");
    if (!tableBody) return;

    // Falls keine Treffer vorliegen
    if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:30px; color:var(--text-muted);">Keine Beiträge gefunden.</td></tr>`;
        return;
    }

    // HTML-Zeilen für jeden Beitrag erzeugen
    tableBody.innerHTML = data.map(post => `
        <tr>
            <td data-label="Datum">${post.date_formatted}</td>
            <td data-label="Titel"><strong>${post.title}</strong></td>
            <td data-label="Vorschau"><small class="text-muted">${post.excerpt || 'Keine Vorschau verfügbar'}</small></td>
            <td class="actions-cell">
                <button onclick="handleEditPost('${encodeURIComponent(JSON.stringify(post))}')" class="edit-btn" title="Bearbeiten">✏️</button>
                <button onclick="handleDeletePost(${post.post_id})" class="delete-btn" title="Löschen">🗑️</button>
            </td>
        </tr>
    `).join('');
}

/**
 * Füllt das Modal-Formular mit den Daten eines existierenden Beitrags
 */
window.handleEditPost = function(encodedData) {
    const post = JSON.parse(decodeURIComponent(encodedData));
    
    document.getElementById("postId").value = post.post_id;
    document.getElementById("newsTitle").value = post.title;
    document.getElementById("newsContent").value = post.content;
    document.getElementById("newsImage").value = post.image || "";
    
    document.getElementById("newsModalTitle").innerText = "Beitrag bearbeiten";
    document.getElementById("newsModal").classList.add("active");
};

/**
 * Entfernt die 'active'-Klasse, um das Modal zu verstecken
 */
window.closeNewsModal = function() {
    document.getElementById("newsModal").classList.remove("active");
};

/**
 * Sendet eine Lösch-Anfrage für eine bestimmte ID an den Server
 */
window.handleDeletePost = async function(id) {
    if (!confirm("Möchtest du diesen Beitrag wirklich unwiderruflich löschen?")) return;

    try {
        const res = await fetch('/CMS_Verein/src/db/query/post/admin/deleteNews.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        });
        
        const result = await res.json();
        if (result.success) {
            loadNews(); // Liste nach Löschung neu laden
        } else {
            alert("Fehler beim Löschen: " + (result.message || "Unbekannter Fehler"));
        }
    } catch (e) {
        console.error("Fehler beim Löschen:", e);
    }
};

/**
 * Initialisierung der Seite
 */
document.addEventListener("DOMContentLoaded", () => {
    loadNews(); // Daten beim Start abrufen

    const newsForm = document.getElementById("newsForm");
    const openModalBtn = document.getElementById("openNewsModal");

    // Modal für einen komplett neuen Beitrag vorbereiten
    if (openModalBtn) {
        openModalBtn.onclick = () => {
            newsForm.reset();
            document.getElementById("postId").value = ""; // ID leeren = Neu-Modus
            document.getElementById("newsModalTitle").innerText = "Neuer Beitrag";
            document.getElementById("newsModal").classList.add("active");
        };
    }

    // Filter-Updates bei jeder Eingabe auslösen (Echtzeit-Suche)
    const filterElements = ["newsSearch", "filterMonth", "sortOrder"];
    filterElements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("input", applyFilters);
    });

    // Speichern-Logik (Erstellen & Aktualisieren)
    if (newsForm) {
        newsForm.onsubmit = async (e) => {
            e.preventDefault(); // Verhindert Neuladen der Seite
            
            const formData = {
                post_id: document.getElementById("postId").value,
                title: document.getElementById("newsTitle").value,
                content: document.getElementById("newsContent").value,
                image: document.getElementById("newsImage").value
            };

            try {
                const res = await fetch('/CMS_Verein/src/db/query/post/admin/saveNews.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
                const result = await res.json();
                if (result.success) {
                    closeNewsModal();
                    loadNews(); // Liste aktualisieren
                } else {
                    alert("Fehler beim Speichern: " + result.message);
                }
            } catch (err) {
                console.error("Speicherfehler:", err);
            }
        };
    }
});