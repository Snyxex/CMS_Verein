class AppNavbar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <link rel="stylesheet" href="../../public/styles/navbar.css">
      <nav class="navbar">
        <div class="navbar-inner">
          <a href="../../index.html" class="logo">MyApp</a>

          <ul class="nav-center">
            <li><a href="../../index.html">Home</a></li>
            <li><a href="../../public/calender.html">Kalender</a></li>
            <li><a href="../../public/guestbook.html">Gästebuch</a></li>
            <li><a href="../../public/news.html">News</a></li>
          </ul>

          <div class="nav-right">
            <div class="desktop-only">
              <a href="../../public/auth/login.html" class="btn">Login</a>
              <a href="../../public/auth/register.html" class="btn primary">Register</a>
            </div>
            
            <button class="hamburger" aria-label="Menü">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>

        <div class="mobile-menu">
          <a href="../../index.html">Home</a>
          <a href="../../public/calender.html">Kalender</a>
          <a href="../../public/guestbook.html">Gästebuch</a>
          <a href="../../public/news.html">News</a>
          <div class="divider"></div>
          <a href="../../public/auth/login.html">Login</a>
          <a href="../../public/auth/register.html">Register</a>
        </div>
      </nav>
    `;

    // Logik bleibt wie sie ist
    const hamburger = this.querySelector(".hamburger");
    const menu = this.querySelector(".mobile-menu");

    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("open");
      menu.classList.toggle("open");
    });

    menu.querySelectorAll("a").forEach(link =>
      link.addEventListener("click", () => {
        hamburger.classList.remove("open");
        menu.classList.remove("open");
      })
    );
  }
}

customElements.define("app-navbar", AppNavbar);