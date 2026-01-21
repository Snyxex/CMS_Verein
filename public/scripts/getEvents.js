async function loadCalendarEvents() {
    const calendar = document.querySelector('app-calendar');
    
    
    if (!calendar) return;

    try {
        const response = await fetch('/CMS_Verein/src/db/query/get/getEvents.php');
        const data = await response.json();
        
        
        calendar.setAppointments(data);
    } catch (error) {
        console.error("API-Verbindungsfehler:", error);
    }
}


document.addEventListener('DOMContentLoaded', loadCalendarEvents);