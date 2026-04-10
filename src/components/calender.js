/**
 * AppCalendar Web Component
 * Erstellt eine interaktive Wochenansicht für Vereinstermine <app-calendar>
 */
class AppCalendar extends HTMLElement {
  constructor() {
    super();
    this.currentDate = new Date(); // Das aktuell angezeigte Datum (Referenz für die Woche)
    this.appointments = [];        // Speicher für alle vom Server geladenen Termine
    this.modalClickHandler = null; // Referenz für den Event-Listener, um Speicherlecks zu vermeiden
  }

  // Wird aufgerufen, wenn die Komponente ins HTML eingefügt wird
  connectedCallback() {
    this.render();
  }

  // Wird aufgerufen, wenn die Komponente entfernt wird (wichtig zum Aufräumen)
  disconnectedCallback() {
    if (this.modalClickHandler) {
      window.removeEventListener('click', this.modalClickHandler);
    }
  }

  /**
   * Nimmt die Daten vom Server entgegen und löst ein neues Zeichnen aus
   */
  setAppointments(data) {
    console.log("Daten empfangen!");
    this.appointments = data;
    this.render();
  }

  /**
   * Hilfsfunktion: Berechnet den Montag der Woche eines beliebigen Datums
   */
  getMonday(d) {
    const date = new Date(d);
    const day = date.getDay();
    // Korrektur: In JS ist Sonntag=0. Diese Formel setzt den Wochenstart immer auf Montag.
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }

  /**
   * Erzeugt das HTML-Layout des Kalenders
   */
  render() {
    const monday = this.getMonday(this.currentDate);
    const weekDays = [];
    
    // Array mit allen 7 Tagen der aktuellen Woche füllen
    for (let i = 0; i < 7; i++) { 
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      weekDays.push(day);
    }

    // Heutiges Datum als String (YYYY-MM-DD) für den "Heute"-Marker
    const todayStr = new Date().toISOString().split('T')[0];

    this.innerHTML = `
      <link rel="stylesheet" href="/CMS_Verein/public/styles/calender.css">
      <div class="calendar-container">
        <div class="calendar-header">
          <button id="prevWeek"> Zurück </button>
          <h2>Woche vom ${monday.toLocaleDateString('de-DE')}</h2>
          <button id="todayBtn" class="today-btn">Heute</button>
          <button id="nextWeek"> Vorwärts </button>
        </div>
        
        <div class="calendar-grid">
          ${weekDays.map(d => `
            <div class="grid-label">
              ${d.toLocaleDateString('de-DE', { weekday: 'short' })}<br>
              <small>${d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}</small>
            </div>
          `).join('')}

          ${weekDays.map(day => {
            const year = day.getFullYear();
            const month = String(day.getMonth() + 1).padStart(2, '0');
            const date = String(day.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${date}`;
            
            const isToday = todayStr === dateStr ? 'is-today' : '';
            
            // Filtert alle Termine heraus, die an genau diesem Tag stattfinden
            const dailyApps = this.appointments.filter(a => {
              if (!a.event_date) return false;
              return a.event_date.substring(0, 10) === dateStr;
            });
            
            return `
              <div class="day-cell ${isToday}">
                ${dailyApps.map((app, index) => `
                  <div class="appointment" data-date="${dateStr}" data-index="${index}">
                    <span class="subject">${app.title}</span>
                    <span class="room">${app.location || ''}</span>
                  </div>
                `).join('')}
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div id="infoModal" class="modal">
        <div class="modal-content">
          <span class="close-btn">&times;</span>
          <h3 id="modalTitle"></h3>
          <div id="modalBody"></div>
        </div>
      </div>
    `;

    this.initEventListeners();
  }

  /**
   * Aktiviert alle Klick-Funktionen (Navigation & Termindetails)
   */
  initEventListeners() {
    const modal = this.querySelector('#infoModal');

    // Navigation: Eine Woche zurück
    this.querySelector('#prevWeek').onclick = () => {
      this.currentDate.setDate(this.currentDate.getDate() - 7);
      this.render();
    };

    // Navigation: Zur aktuellen Woche springen
    this.querySelector('#todayBtn').onclick = () => {
      this.currentDate = new Date();
      this.render();
    };

    // Navigation: Eine Woche vorwärts
    this.querySelector('#nextWeek').onclick = () => {
      this.currentDate.setDate(this.currentDate.getDate() + 7);
      this.render();
    };

    // Klick auf einen Termin: Modal mit Details befüllen und anzeigen
    this.querySelectorAll('.appointment').forEach(el => {
      el.onclick = () => {
        const dateStr = el.dataset.date;
        const index = parseInt(el.dataset.index);
        
        const dailyApps = this.appointments.filter(a => a.event_date.substring(0, 10) === dateStr);
        const app = dailyApps[index];

        if (app) {
          this.querySelector('#modalTitle').innerText = app.title;
          this.querySelector('#modalBody').innerHTML = `
            <p><strong>Wann:</strong> ${new Date(app.event_date).toLocaleDateString('de-DE')}</p>
            <p><strong>Wo:</strong> ${app.location || 'Nicht angegeben'}</p>
            <p><strong>Adresse:</strong> ${app.street || ''}, ${app.zip || ''}</p>
            <hr>
            <p><strong>Info:</strong><br>${app.description || 'Keine Beschreibung vorhanden.'}</p>
          `;
          modal.classList.add('active');
        }
      };
    });

    // Modal über das 'X' schließen
    this.querySelector('.close-btn').onclick = () => {
      modal.classList.remove('active');
    };
    
    // Modal schließen, wenn man in den dunklen Bereich außerhalb klickt
    this.modalClickHandler = (event) => {
      if (event.target === modal) {
        modal.classList.remove('active');
      }
    };
    window.addEventListener('click', this.modalClickHandler);
  }
}

customElements.define("app-calendar", AppCalendar);