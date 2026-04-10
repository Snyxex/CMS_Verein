/**
 * Kalender-Daten-Loader
 * Diese Funktion verbindet die Datenbank-Schnittstelle mit der Web Component
 */
async function loadCalendarEvents() {
    // Sucht das benutzerdefinierte <app-calendar> Element auf der Seite
    const calendar = document.querySelector('app-calendar');
    
    // Sicherheitscheck: Existiert das Kalender-Element überhaupt auf dieser Seite?
    if (!calendar) {
        console.error("❌ Kalender-Element nicht im DOM!");
        return;
    }

    try {
        /**
         * WICHTIG: Wartet, bis der Browser die Web Component 'app-calendar' 
         * fertig registriert hat, damit Funktionen wie setAppointments() verfügbar sind.
         */
        await customElements.whenDefined('app-calendar');
        
        // Abruf der Termine vom PHP-Backend
        const response = await fetch('/CMS_Verein/src/db/query/get/getEvents.php');
       
        // Fehlerprüfung: Hat der Server geantwortet? (z.B. 404 oder 500 Fehler)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // JSON-Daten in ein JavaScript-Objekt umwandeln
        const data = await response.json();
       
        // Prüfung: Sind die Daten eine Liste (Array)? Das ist für die Anzeige zwingend.
        if (!Array.isArray(data)) {
            console.error('❌ Ungültiges Datenformat - kein Array!');
            return;
        }
        
        /**
         * Daten an die Web Component übergeben.
         * Ruft die Methode setAppointments() innerhalb der Klasse AppCalendar auf.
         */
        calendar.setAppointments(data);
 
    } catch (error) {
        // Detaillierte Fehlerausgabe in der Konsole bei Problemen
        console.error("❌ FEHLER:", error);
        console.error("   - Message:", error.message);
        console.error("   - Stack:", error.stack);
    }
}

/**
 * Initialisierung beim Seitenstart
 * Stellt sicher, dass die Lade-Funktion zum richtigen Zeitpunkt aufgerufen wird.
 */
if (document.readyState === 'loading') {
    // Falls das HTML noch geladen wird: Warte auf das 'DOMContentLoaded' Event
    document.addEventListener('DOMContentLoaded', () => {
        loadCalendarEvents();
    });
} else {
    // Falls das HTML bereits fertig geladen ist (z.B. durch verzögertes Skript): Sofort starten
    loadCalendarEvents();
}