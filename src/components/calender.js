class AppCalendar extends HTMLElement {
  constructor() {
    super();
    this.currentDate = new Date();
    this.appointments = [];
  }

  connectedCallback() {
    this.render();
  }

  setAppointments(data) {
    this.appointments = data;
    this.render();
  }

  getMonday(d) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }

  render() {
    const monday = this.getMonday(this.currentDate);
    const weekDays = [];
    for (let i = 0; i < 5; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      weekDays.push(day);
    }

    this.innerHTML = `
    <link rel="stylesheet" href="/CMS_Verein/public/styles/calender.css">
      <div class="calendar-container">
        <div class="calendar-header">
          <button id="prevWeek"> Zurück </button>
          <h2>Woche vom ${monday.toLocaleDateString('de-DE')}</h2>
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
            const dateStr = day.toISOString().split('T')[0];
            const isToday = new Date().toISOString().split('T')[0] === dateStr ? 'is-today' : '';
            const dailyApps = this.appointments.filter(a => a.date === dateStr);
            
            return `
              <div class="day-cell ${isToday}">
                ${dailyApps.map((app, index) => `
                  <div class="appointment" data-date="${dateStr}" data-index="${index}">
                    <span class="subject">${app.title}</span>
                    <span class="room">${app.room || ''}</span>
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
          <p id="modalBody"></p>
        </div>
      </div>
    `;

    this.initEventListeners();
  }

  initEventListeners() {
    this.querySelector('#prevWeek').onclick = () => {
      this.currentDate.setDate(this.currentDate.getDate() - 7);
      this.render();
    };
    this.querySelector('#nextWeek').onclick = () => {
      this.currentDate.setDate(this.currentDate.getDate() + 7);
      this.render();
    };

    const modal = this.querySelector('#infoModal');
    this.querySelectorAll('.appointment').forEach(el => {
      el.onclick = () => {
        const app = this.appointments.filter(a => a.date === el.dataset.date)[el.dataset.index];
        this.querySelector('#modalTitle').innerText = app.title;
        this.querySelector('#modalBody').innerText = `Raum: ${app.room || 'Kein Raum'}\nInfo: ${app.description || '-'}`;
        modal.classList.add('active');
      };
    });

    this.querySelector('.close-btn').onclick = () => modal.classList.remove('active');
  }
}

customElements.define("app-calendar", AppCalendar);