class AppNavbar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
<nav class="navbar">
  <div class="navbar-container">
    <a href="../../index.html" class="logo">MyApp</a>

    <!-- Hamburger Button -->
    <button class="hamburger" aria-label="Menü">
      &#9776;
    </button>

    <!-- Alles in einem Container, auch Buttons -->
    <ul class="nav-links">
      <li><a href="../../index.html">Home</a></li>
      <li><a href="../../public/calender.html">Kalender</a></li>
      <li><a href="../../public/guestbook.html">Gästebuch</a></li>
      <li><a href="../../public/news.html">News</a></li>
      <li><a href="../../public/auth/login.html">Login</a></li>
      <li><a href="../../public/auth/register.html">Register</a></li>
    </ul>
  </div>
</nav>



    `;
  }
}

customElements.define("app-navbar", AppNavbar);

const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});

