class AppCalendar extends HTMLElement {
  constructor() {
    super();
    this.currentDate = new Date();
    this.appointments = []; // Format: { date: '2024-05-22', hour: 1, title: 'Mathe', room: 'R101' }
  }

  connectedCallback() {
    this.render();
  }

  setAppointments(data) {
    this.appointments = data;
    this.render();
  }

  // Hilfsfunktion: Montag der aktuellen Woche finden
  getMonday(d) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }

  // Hilfsfunktion: Datum in YYYY-MM-DD Format
  formatDate(date) {
    return date.toISOString().split('T')[0];
  }

  render() {
    const monday = this.getMonday(this.currentDate);
    const weekDays = [];
    
    // Erstelle Array mit Daten für Mo-Fr
    for (let i = 0; i < 5; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      weekDays.push(day);
    }

    const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00"];

    this.innerHTML = `
    <link rel="stylesheet" href="/CMS_Verein/public/styles/calender.css">
      <div class="calendar-container">
        <div class="calendar-header">
          <button id="prevWeek"> Zurück </button>
          <h2>Woche vom ${monday.toLocaleDateString('de-DE')}</h2>
          <button id="nextWeek"> Vorwärts </button>
        </div>
        
        <div class="calendar-grid">
          <div class="grid-label">Zeit</div>
          ${weekDays.map(d => `
            <div class="grid-label">
              ${d.toLocaleDateString('de-DE', { weekday: 'short' })}<br>
              <small>${d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}</small>
            </div>
          `).join('')}

          ${timeSlots.map((time, hourIndex) => `
            <div class="time-cell">${time}</div>
            ${weekDays.map(day => {
              const dateStr = this.formatDate(day);
              const isToday = this.formatDate(new Date()) === dateStr ? 'is-today' : '';
              const app = this.appointments.find(a => a.date === dateStr && parseInt(a.hour) === hourIndex);
              
              return `
                <div class="day-cell ${isToday}">
                  ${app ? `
                    <div class="appointment">
                      <div class="subject">${app.title}</div>
                      <div class="room">${app.room || '-'}</div>
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('')}
          `).join('')}
        </div>
      </div>
    `;

    this.initEventListeners();
  }

  initEventListeners() {
    const prevBtn = this.querySelector('#prevWeek');
    const nextBtn = this.querySelector('#nextWeek');

    if(prevBtn) {
      prevBtn.onclick = () => {
        this.currentDate.setDate(this.currentDate.getDate() - 7);
        this.render();
      };
    }

    if(nextBtn) {
      nextBtn.onclick = () => {
        this.currentDate.setDate(this.currentDate.getDate() + 7);
        this.render();
      };
    }
  }
}

customElements.define("app-calendar", AppCalendar);