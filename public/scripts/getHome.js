fetch("/CMS_Verein/src/db/query/get/getHome.php")
    .then(response => response.json())
    .then(data => {

        // Verein
        document.getElementById("clubName").textContent = data.club.name;
        document.getElementById("clubDescription").textContent = data.club.description;
        if (data.club && data.club.logo) {
            document.getElementById("clubLogo").src = data.club.logo;
        } else {
            document.getElementById("clubLogo").style.display = "none"; // Logo verstecken, wenn kein Pfad da ist
        }

        // News
        const newsContainer = document.getElementById("newsContainer");
        data.news.forEach(post => {
            const div = document.createElement("div");
            div.classList.add("news-item");
            div.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <small>${post.created_at}</small>
            `;
            newsContainer.appendChild(div);
        });

        const eventContainer = document.getElementById("nextEvent"); // Sicherstellen, dass die ID im HTML existiert!

        if (data.events) {
            const event = data.events;
            eventContainer.classList.add("event-item");
            eventContainer.innerHTML = `
        <h3>${event.title}</h3>
        <div class="event-meta">
            <span>Datum: ${new Date(event.event_date).toLocaleDateString('de-DE')}</span>
            <span>Ort: ${event.location}</span>
        </div>
        <p style="margin-top: 15px;">${event.description}</p>
    `;
        } else {
            eventContainer.innerHTML = "<p>Kein Termin geplant</p>";
        }

        // Stats
       // document.getElementById("memberCount").textContent = data.stats.members;
       // document.getElementById("eventCount").textContent = data.stats.events;
       async function loadStats() {
        try {
            // 1. Mitgliederzahl holen
            const memberResponse = await fetch('src/query/get/getmitglieder.php');
            const memberCount = await memberResponse.text();
            document.getElementById('memberCount').innerText = memberCount;
    
            // 2. Event-Anzahl holen (falls du dafür auch eine PHP-Datei hast)
            // const eventResponse = await fetch('../CMS_Verein/src/db/query/get/geteventcount.php');
            // const eventCount = await eventResponse.text();
            // document.getElementById('eventCount').innerText = eventCount;
    
        } catch (error) {
            console.error('Fehler beim Laden der Stats:', error);
            document.getElementById('memberCount').innerText = '!';
        }
    }
    
    // Einmal beim Laden ausführen
    updateMemberCount();
    })
    .catch(() => {
        console.error("Fehler beim Laden der Homepage-Daten");
    });
