document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM geladen, starte Datenabruf...");
    loadMemberDashboard();
});

async function loadMemberDashboard() {
    try {
        const response = await fetch('/CMS_Verein/src/db/query/get/mitglieder/getMemberDashboard.php');
        
        if (!response.ok) {
            console.error("HTTP-Fehler:", response.status);
            return;
        }

        const data = await response.json();
        console.log("Empfangene Daten vom Server:", data); // WICHTIG: Hier prüfen, ob Arrays leer sind!

        // --- Club Name ---
        const heroTitle = document.querySelector('.member-hero h1');
        if (heroTitle && data.club) {
            heroTitle.innerText = `Willkommen im ${data.club.name}`;
        }

        // --- Events (Tabellen-Check: events) ---
        const eventList = document.getElementById("userEventList");
        if (eventList) {
            if (data.events && data.events.length > 0) {
                eventList.innerHTML = data.events.map(ev => `
                    <div class="agenda-item">
                        <div class="agenda-date">
                            ${new Date(ev.event_date).getDate()}<br>
                            <small>${new Date(ev.event_date).toLocaleString('de-DE', {month: 'short'})}</small>
                        </div>
                        <div>
                            <strong>${ev.title}</strong><br>
                            <small>📍 ${ev.location || 'Vereinsheim'}</small>
                        </div>
                    </div>
                `).join('');
            } else {
                eventList.innerHTML = "<p>Keine anstehenden Termine gefunden.</p>";
            }
        }

        // --- Mitglieder (Tabellen-Check: members) ---
        const memberList = document.getElementById("userMemberList");
        if (memberList) {
            if (data.members && data.members.length > 0) {
                memberList.innerHTML = data.members.map(m => `
                    <div class="member-card-small">
                        <div>
                            <strong>${m.name}</strong><br>
                            <small>${m.role || 'Mitglied'}</small>
                        </div>
                    </div>
                `).join('');
            } else {
                memberList.innerHTML = "<p>Keine Mitgliederliste verfügbar.</p>";
            }
        }

        // --- News (Tabellen-Check: posts) ---
        const newsList = document.getElementById("userNewsList");
        if (newsList && data.news) {
            newsList.innerHTML = data.news.map(n => `
                <div style="margin-bottom:15px; border-left:3px solid blue; padding-left:10px;">
                    <strong>${n.title}</strong><br>
                    <small>${n.content ? n.content.substring(0, 50) : ''}...</small>
                </div>
            `).join('');
        }

    } catch (error) {
        console.error("KRITISCHER FEHLER:", error);
    }
}