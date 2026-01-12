class AppCalendar extends HTMLElement {
  constructor() {
    super();
    this.currentDate = new Date();
    this.appointments = []; // Hier landen die Datenbank-Daten
  }

  connectedCallback() {
    this.render();
  }

  // Methode, um Daten von außen (Datenbank) zu setzen
  setAppointments(data) {
    this.appointments = data;
    this.render(); // Neu zeichnen, wenn Daten kommen
  }

  render() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const monthName = new Intl.DateTimeFormat('de-DE', { month: 'long' }).format(this.currentDate);

    // Kalender-Logik: Erster Tag und Anzahl Tage im Monat
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Korrektur für deutschen Wochenstart (Montag statt Sonntag)
    const startingDay = firstDay === 0 ? 6 : firstDay - 1;

    this.innerHTML = `
     <link rel="stylesheet" href="../../public/styles/calendar.css">
      <div class="calendar-container">
        <div class="calendar-header">
          <button id="prevMonth">&lt;</button>
          <h2>${monthName} ${year}</h2>
          <button id="nextMonth">&gt;</button>
        </div>
        <div class="calendar-grid">
          <div class="weekday">Mo</div><div class="weekday">Di</div>
          <div class="weekday">Mi</div><div class="weekday">Do</div>
          <div class="weekday">Fr</div><div class="weekday">Sa</div>
          <div class="weekday">So</div>
          ${this.generateDays(startingDay, daysInMonth, year, month)}
        </div>
      </div>
    `;

    this.initEventListeners();
  }

  generateDays(start, total, year, month) {
    let html = '';
    // Leere Felder am Anfang
    for (let i = 0; i < start; i++) {
      html += `<div class="day empty"></div>`;
    }
    // Die eigentlichen Tage
    for (let day = 1; day <= total; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // Prüfen, ob für diesen Tag Termine in den Datenbank-Daten existieren
      const hasAppointment = this.appointments.some(app => app.date === dateStr);
      const activeClass = hasAppointment ? 'has-event' : '';
      const todayClass = new Date().toISOString().split('T')[0] === dateStr ? 'today' : '';

      html += `
        <div class="day ${activeClass} ${todayClass}" data-date="${dateStr}">
          <span class="day-number">${day}</span>
          ${hasAppointment ? '<div class="event-dot"></div>' : ''}
        </div>
      `;
    }
    return html;
  }

  initEventListeners() {
    this.querySelector('#prevMonth').onclick = () => {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.render();
    };
    this.querySelector('#nextMonth').onclick = () => {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.render();
    };
    
    // Klick auf einen Tag
    this.querySelectorAll('.day:not(.empty)').forEach(dayEl => {
      dayEl.onclick = () => {
        const date = dayEl.dataset.date;
        const event = this.appointments.find(a => a.date === date);
        if(event) alert(`Termin am ${date}: ${event.title}`);
      };
    });
  }
}

customElements.define("app-calendar", AppCalendar);