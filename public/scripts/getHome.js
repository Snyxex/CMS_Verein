fetch("/CMS_Verein/src/db/query/get/getHome.php")
    .then(response => {
        if (!response.ok) throw new Error("Netzwerk-Antwort war nicht ok");
        return response.json();
    })
    .then(data => {
        // --- 1. VEREINSDATEN ---
        if (data.club) {
            document.getElementById("clubName").textContent = data.club.name || "Vereinsname";
            document.getElementById("clubDescription").textContent = data.club.description || "";
            const logoImg = document.getElementById("clubLogo");
            if (data.club.logo) {
                logoImg.src = data.club.logo;
                logoImg.style.display = "block";
            } else {
                logoImg.style.display = "none";
            }
        }

        // --- 2. NEWS ---
        const newsContainer = document.getElementById("newsContainer");
        if (newsContainer && data.news) {
            newsContainer.innerHTML = ""; // Container leeren
            data.news.forEach(post => {
                const div = document.createElement("div");
                div.classList.add("news-item");
                div.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.content}</p>
                    <small>${new Date(post.created_at).toLocaleDateString('de-DE')}</small>
                `;
                newsContainer.appendChild(div);
            });
        }

        // --- 3. NÄCHSTES EVENT ---
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

        // --- 4. STATISTIKEN (Stats) ---
        // Hier nutzen wir die Daten direkt aus dem Stats-Objekt deines PHP
        if (data.stats) {
            const memCountEl = document.getElementById("memberCount");
            const evCountEl = document.getElementById("eventCount");
            
            if (memCountEl) memCountEl.textContent = data.stats.members;
            if (evCountEl) evCountEl.textContent = data.stats.events;
        }
    })
    .catch(error => {
        console.error("Fehler beim Laden der Homepage-Daten:", error);
    });