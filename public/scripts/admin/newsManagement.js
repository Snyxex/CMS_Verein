// Globaler Speicher für die News-Daten
let allNews = [];

/**
 * Lädt alle News vom Server
 */
async function loadNews() {
    try {
        const response = await fetch('/CMS_Verein/src/db/query/get/admin/getNews.php');
        const data = await response.json();
        
        if (data.error) {
            console.error("Server-Fehler:", data.error);
            return;
        }

        allNews = data;
        applyFilters(); // Erstmaliges Rendern mit Standard-Filtern
    } catch (e) {
        console.error("Netzwerkfehler beim Laden der News:", e);
    }
}

/**
 * Filtert und sortiert die News basierend auf den Benutzereingaben
 */
function applyFilters() {
    const searchTerm = document.getElementById("newsSearch").value.toLowerCase();
    const monthFilter = document.getElementById("filterMonth").value;
    const sortOrder = document.getElementById("sortOrder").value;

    let filtered = allNews.filter(post => {
        // 1. Suche in Titel und Inhalt
        const matchesSearch = post.title.toLowerCase().includes(searchTerm) || 
                              post.content.toLowerCase().includes(searchTerm);
        
        // 2. Filter nach Monat
        const postDate = new Date(post.created_at);
        const matchesMonth = (monthFilter === "all") || 
                             (postDate.getMonth().toString() === monthFilter);

        return matchesSearch && matchesMonth;
    });

    // 3. Sortierung (Datum)
    filtered.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    renderNewsTable(filtered);
}

/**
 * Erzeugt die HTML-Zeilen für die Tabelle
 */
function renderNewsTable(data) {
    const tableBody = document.getElementById("newsTableBody");
    if (!tableBody) return;

    if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:30px; color:var(--text-muted);">Keine Beiträge gefunden.</td></tr>`;
        return;
    }

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
 * Öffnet das Modal zum Bearbeiten und füllt die Felder
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
 * Schließt das News-Modal
 */
window.closeNewsModal = function() {
    document.getElementById("newsModal").classList.remove("active");
};

/**
 * Löscht einen Beitrag nach Bestätigung
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
            loadNews(); // Liste aktualisieren
        } else {
            alert("Fehler beim Löschen: " + (result.message || "Unbekannter Fehler"));
        }
    } catch (e) {
        console.error("Fehler beim Löschen:", e);
    }
};

/**
 * Initialisierung beim Laden der Seite
 */
document.addEventListener("DOMContentLoaded", () => {
    loadNews();

    const newsForm = document.getElementById("newsForm");
    const openModalBtn = document.getElementById("openNewsModal");

    // Modal öffnen (Neu-Modus)
    if (openModalBtn) {
        openModalBtn.onclick = () => {
            newsForm.reset();
            document.getElementById("postId").value = "";
            document.getElementById("newsModalTitle").innerText = "Neuer Beitrag";
            document.getElementById("newsModal").classList.add("active");
        };
    }

    // Event-Listener für Filter-Echtzeit-Update
    const filterElements = ["newsSearch", "filterMonth", "sortOrder"];
    filterElements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("input", applyFilters);
    });

    // Formular absenden (Speichern & Update)
    if (newsForm) {
        newsForm.onsubmit = async (e) => {
            e.preventDefault();
            
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
                    loadNews();
                } else {
                    alert("Fehler beim Speichern: " + result.message);
                }
            } catch (err) {
                console.error("Speicherfehler:", err);
            }
        };
    }
});