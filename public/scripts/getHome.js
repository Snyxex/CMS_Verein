/**
 * Homepage Data Loader
 * Holt alle Inhalte für die Startseite (Vereinsinfos, News, Events, Stats)
 */
fetch("/CMS_Verein/src/db/query/get/getHome.php")
    .then(response => {
        // Prüfen, ob die Verbindung zum Server erfolgreich war
        if (!response.ok) throw new Error("Netzwerk-Antwort war nicht ok");
        return response.json(); // Daten in ein JavaScript-Objekt umwandeln
    })
    .then(data => {
        
        // --- 1. VEREINSDATEN (Name, Beschreibung, Logo) ---
        if (data.club) {
            document.getElementById("clubName").textContent = data.club.name || "Vereinsname";
            document.getElementById("clubDescription").textContent = data.club.description || "";
            
            const logoImg = document.getElementById("clubLogo");
            if (data.club.logo) {
                logoImg.src = data.club.logo; // Logo-Pfad setzen
                logoImg.style.display = "block";
            } else {
                logoImg.style.display = "none"; // Verstecken, wenn kein Logo vorhanden
            }
        }

        // --- 2. NEWS-BEREICH (Aktuelle Beiträge) ---
        const newsContainer = document.getElementById("newsContainer");
        if (newsContainer && data.news) {
            newsContainer.innerHTML = ""; // Platzhalter leeren
            data.news.forEach(post => {
                const div = document.createElement("div");
                div.classList.add("news-item"); // CSS-Klasse für Styling hinzufügen
                div.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.content}</p>
                    <small>${new Date(post.created_at).toLocaleDateString('de-DE')}</small>
                `;
                newsContainer.appendChild(div);
            });
        }

        // --- 3. NÄCHSTES EVENT (Highlight-Termin) ---
        const eventContainer = document.getElementById("nextEvent");
        if (eventContainer) {
            if (data.events) {
                eventContainer.classList.add("event-item");
                eventContainer.innerHTML = `
                    <h3>${data.events.title}</h3>
                    <div class="event-meta">
                        <span><strong>Datum:</strong> ${new Date(data.events.event_date).toLocaleDateString('de-DE')}</span><br>
                        <span><strong>Ort:</strong> ${data.events.location || 'Nicht angegeben'}</span>
                    </div>
                    <p style="margin-top: 15px;">${data.events.description || ''}</p>
                `;
            } else {
                eventContainer.innerHTML = "<p>Kein Termin geplant</p>";
            }
        }

        // --- 4. STATISTIKEN (Mitglieder- und Event-Zähler) ---
        // Diese Zahlen kommen direkt aus der SQL-Zählung (COUNT) deines PHP-Skripts
        if (data.stats) {
            const memCountEl = document.getElementById("memberCount");
            const evCountEl = document.getElementById("eventCount");
            
            if (memCountEl) memCountEl.textContent = data.stats.members;
            if (evCountEl) evCountEl.textContent = data.stats.events;
        }
    })
    .catch(error => {
        // Fehlerbehandlung: Wird ausgelöst bei Datenbankfehlern oder Pfad-Problemen
        console.error("Fehler beim Laden der Homepage-Daten:", error);
    });