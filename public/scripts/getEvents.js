// DEBUG-VERSION - Temporär verwenden zum Fehler finden

async function loadCalendarEvents() {
   
    const calendar = document.querySelector('app-calendar');
    
    
    if (!calendar) {
        console.error("❌ Kalender-Element nicht im DOM!");
        return;
    }

    try {
        
        await customElements.whenDefined('app-calendar');
        
        const response = await fetch('/CMS_Verein/src/db/query/get/getEvents.php');
       
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
       
        
        if (!Array.isArray(data)) {
            console.error('❌ Ungültiges Datenformat - kein Array!');
            return;
        }
        
       
        calendar.setAppointments(data);
 
        
    } catch (error) {
        console.error("❌ FEHLER:", error);
        console.error("   - Message:", error.message);
        console.error("   - Stack:", error.stack);
    }
}



if (document.readyState === 'loading') {
   
    document.addEventListener('DOMContentLoaded', () => {
    
        loadCalendarEvents();
    });
} else {
   
    loadCalendarEvents();
}