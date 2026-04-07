document.addEventListener("DOMContentLoaded", () => {
    // Aktuelles Datum anzeigen
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById("currentDateDisplay").innerText = new Date().toLocaleDateString('de-DE', options);
    
    loadDashboardData();
});

async function loadDashboardData() {
    try {
        const response = await fetch('/CMS_Verein/src/db/query/get/admin/getDashboard.php');
        const data = await response.json();

        // Counter
        document.getElementById("countMembers").textContent = data.counts.members;
        document.getElementById("countEvents").textContent = data.counts.events;
        document.getElementById("countPosts").textContent = data.counts.posts;
        document.getElementById("countGB").textContent = data.counts.gb;

        // Agenda (Termine) mit Datums-Icon Style
        const eventList = document.getElementById("nextEventsList");
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

        // Gästebuch Mini-Karten
        const activityList = document.getElementById("activityList");
        activityList.innerHTML = data.recentGB.map(gb => `
            <div class="recent-item">
                <strong>${gb.name}</strong>: 
                <span class="text-muted">"${gb.message ? gb.message.substring(0, 40) + '...' : 'Kein Text'}"</span>
                <br><small>${gb.date_formatted}</small>
            </div>
        `).join('');

    } catch (error) {
        console.error("Dashboard Error:", error);
    }
}