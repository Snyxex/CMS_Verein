class AppNavbar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
         <nav class="navbar">
        <a href="index.html" class="logo">MyApp</a>
        <ul class="nav-links">
          <li><a href="index.html">Home</a></li>
          <li><a href="Kalender.html">Kalender</a></li>
          <li><a href="guestbook.html">Gästebuch</a></li>
        </ul>
      </nav>
      `;
        
    }
}

customElements.define('app-navbar', AppNavbar);
