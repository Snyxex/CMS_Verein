fetch("/CMS_Verein/src/db/query/get/getHome.php")
    .then(response => response.json())
    .then(data => {

        // Verein
        document.getElementById("clubName").textContent = data.club.name;
        document.getElementById("clubDescription").textContent = data.club.description;
       document.getElementById("clubLogo").src = data.club.logo;

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

        // Event
        if (data.events) {
            const event = data.events;
           const form =  document.getElementById("nextEvent");
           form.classList.add("event-item");
           form.innerHTML = `
                <strong>${event.title}</strong><br>
                ${event.event_date} – ${event.location}
                event.description
            `;
        } else {
            document.getElementById("nextEvent").textContent = "Kein Termin geplant";
        }

        // Stats
        document.getElementById("memberCount").textContent = data.stats.members;
        document.getElementById("eventCount").textContent = data.stats.events;
    })
    .catch(() => {
        console.error("Fehler beim Laden der Homepage-Daten");
    });
