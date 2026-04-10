/**
 * Admin-Dashboard Logik
 * Initialisiert die Übersicht beim Laden der Seite und ruft Statistiken ab.
 */
document.addEventListener("DOMContentLoaded", () => {
    // 1. Aktuelles Datum formatieren und anzeigen (z. B. "Freitag, 10. April 2026")
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateDisplay = document.getElementById("currentDateDisplay");
    if (dateDisplay) {
        dateDisplay.innerText = new Date().toLocaleDateString('de-DE', options);
    }
    
    // Daten vom Server laden
    loadDashboardData();
});

/**
 * Holt alle relevanten Dashboard-Daten (Stats, Termine, Aktivitäten)
 */
async function loadDashboardData() {
    try {
        // Anfrage an das zentrale Dashboard-PHP-Skript
        const response = await fetch('/CMS_Verein/src/db/query/get/admin/getDashboard.php');
        const data = await response.json();

        // --- 2. STATISTIK-ZÄHLER (Counter) ---
        // Befüllt die Kacheln mit der Anzahl der Mitglieder, Events, News und Gästebucheinträge
        document.getElementById("countMembers").textContent = data.counts.members;
        document.getElementById("countEvents").textContent = data.counts.events;
        document.getElementById("countPosts").textContent = data.counts.posts;
        document.getElementById("countGB").textContent = data.counts.gb;

        // --- 3. AGENDA (Kommende Termine) ---
        const eventList = document.getElementById("nextEventsList");
        if (eventList) {
            // Erzeugt für jeden Termin ein "Kalenderblatt"-Icon und Details
            eventList.innerHTML = data.upcomingEvents.map(ev => {
                const d = new Date(ev.event_date);
                const day = d.getDate();
                const month = d.toLocaleString('de-DE', { month: 'short' });
                
                return `
                    <div class="agenda-item">
                        <div class="agenda-date">
                            ${day}<br><small>${month.toUpperCase()}</small>
                        </div>
                        <div>
                            <div style="font-weight:600;">${ev.title}</div>
                            <small class="text-muted">📍 ${ev.location || 'Vereinsheim'}</small>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // --- 4. REZENTE AKTIVITÄTEN (Gästebuch-Vorschau) ---
        const activityList = document.getElementById("activityList");
        if (activityList) {
            // Zeigt die neuesten Einträge im Gästebuch kurz und knapp an
            activityList.innerHTML = data.recentGB.map(gb => `
                <div class="recent-item">
                    <strong>${gb.name}</strong>: 
                    <span class="text-muted">"${gb.message ? gb.message.substring(0, 40) + '...' : 'Kein Text'}"</span>
                    <br><small>${gb.date_formatted}</small>
                </div>
            `).join('');
        }

    } catch (error) {
        // Fehlerbehandlung, falls das PHP-Skript nicht erreichbar ist
        console.error("Dashboard Error:", error);
    }
}