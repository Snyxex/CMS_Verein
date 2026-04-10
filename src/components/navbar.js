/**
 * Navbar Web Component
 * Erstellt das öffentliche Menü <app-navbar> für alle Besucher
 */
class AppNavbar extends HTMLElement {
  connectedCallback() {
    // Das HTML-Gerüst der Navbar definieren
    this.innerHTML = `
    <link rel="stylesheet" href="/CMS_Verein/public/styles/navbar.css">
    <nav class="navbar">
      <div class="navbar-inner">
        <a href="/CMS_Verein/index.html" class="logo" id="nav-club-logo">LADEN...</a>

        <ul class="nav-center">
          <li><a href="/CMS_Verein/index.html">Home</a></li>
          <li><a href="/CMS_Verein/public/calender.html">Kalender</a></li>
          <li><a href="/CMS_Verein/public/guestbook.html">Kommentare</a></li>
          <li><a href="/CMS_Verein/src/db/query/news.php">News</a></li>
          <li><a href="/CMS_Verein/public/mitglieder.html">Mitglieder</a></li>
        </ul>

        <div class="nav-right">
          <div class="desktop-only">
            <a href="/CMS_Verein/public/auth/login.html" class="btn">Login</a>
            <a href="/CMS_Verein/public/auth/register.html" class="btn primary">Register</a>
          </div>
          <button class="hamburger" aria-label="Menü">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      <div class="mobile-menu">
        <a href="/CMS_Verein/index.html">Home</a>
        <a href="/CMS_Verein/public/calender.html">Kalender</a>
        <a href="/CMS_Verein/public/guestbook.html">Gästebuch</a>
        <a href="/CMS_Verein/src/db/query/news.php">News</a>
        <a href="/CMS_Verein/public/mitglieder.html">Mitglieder</a>
        <div class="divider"></div>
        <a href="/CMS_Verein/public/auth/login.html">Login</a>
        <a href="/CMS_Verein/public/auth/register.html">Register</a>
      </div>
    </nav>
    `;

    // 1. Vereinsnamen abrufen, um das Logo zu aktualisieren
    this.updateLogo();

    // 2. Klick-Logik für den Hamburger (Mobile Menu Toggle)
    const hamburger = this.querySelector(".hamburger");
    const menu = this.querySelector(".mobile-menu");
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("open"); // Animiert das Icon zum "X"
      menu.classList.toggle("open");      // Schiebt das Menü ins Bild
    });
  }

  /**
   * Holt Vereinsdaten vom Server und erstellt ein Kurz-Logo (z.B. "SCB" aus "SC Beispieldorf")
   */
  updateLogo() {
    fetch("/CMS_Verein/src/db/query/get/getHome.php")
      .then(response => response.json())
      .then(data => {
        if (data.club && data.club.name) {
          const logoEl = this.querySelector("#nav-club-logo");
          
          // Entfernt alle Leerzeichen aus dem Namen
          const cleanName = data.club.name.replace(/\s+/g, '');
          
          // Kürzt den Namen auf die ersten 3 Zeichen und macht sie groß
          logoEl.textContent = cleanName.substring(0, 3).toUpperCase();
        }
      })
      .catch(err => {
        console.error("Navbar Logo Fehler:", err);
        // Fallback-Name, falls der Server nicht antwortet
        this.querySelector("#nav-club-logo").textContent = "FCB";
      });
  }
}

// Das Element offiziell registrieren
customElements.define("app-navbar", AppNavbar);