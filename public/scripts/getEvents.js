/**
 * Diese Version enthält zusätzliche Prüfungen, um Fehler in der Kommunikation
 * zwischen PHP und der Web-Component schneller zu finden.
 */
async function loadCalendarEvents() {
    // Greift auf das <app-calendar> Element zu
    const calendar = document.querySelector('app-calendar');
    
    // Prüfung 1: Existiert das Kalender-Tag überhaupt im HTML?
    if (!calendar) {
        console.error("❌ Kalender-Element nicht im DOM! Check dein HTML-Tag.");
        return;
    }

    try {
        /**
         * Prüfung 2: Warten auf die Registrierung
         * Verhindert 'undefined' Fehler, falls das Skript schneller als die Komponente ist.
         */
        await customElements.whenDefined('app-calendar');
        
        // Abruf der Termindaten vom Server
        const response = await fetch('/CMS_Verein/src/db/query/get/getEvents.php');
       
        // Prüfung 3: Server-Status (z.B. 404 Pfad falsch oder 500 PHP Fehler)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Umwandlung der Antwort in ein lesbares JSON-Objekt
        const data = await response.json();
       
        // Prüfung 4: Ist das Ergebnis eine Liste? (Wichtig für die .map() Funktion im Kalender)
        if (!Array.isArray(data)) {
            console.error('❌ Ungültiges Datenformat - PHP hat kein Array geliefert!');
            return;
        }
        
        /**
         * Datenübergabe
         * Schickt das Array an die interne Methode der Web-Component
         */
        calendar.setAppointments(data);
 
    } catch (error) {
        // Detailliertes Fehler-Logging für die Browser-Konsole (F12)
        console.error("❌ FEHLER beim Laden des Kalenders:");
        console.error("   - Nachricht:", error.message);
        console.error("   - Stacktrace:", error.stack);
    }
}

/**
 * Start-Logik
 * Stellt sicher, dass die Funktion erst feuert, wenn das Dokument bereit ist.
 */
if (document.readyState === 'loading') {
    // Falls das Dokument noch lädt: Auf Event warten
    document.addEventListener('DOMContentLoaded', () => {
        loadCalendarEvents();
    });
} else {
    // Falls das Dokument bereits bereit ist (z.B. bei schnellen Verbindungen): Direkt ausführen
    loadCalendarEvents();
}