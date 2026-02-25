class AppSidebar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.initMobileMenu();
    }

    initMobileMenu() {
        // Wir warten kurz, bis das DOM bereit ist
        setTimeout(() => {
            const btn = document.getElementById('mobileMenuBtn');
            const sidebar = this.querySelector('.sidebar');
            
            if (btn && sidebar) {
                btn.onclick = (e) => {
                    e.stopPropagation(); // Verhindert sofortiges Schließen
                    sidebar.classList.toggle('open');
                };

                // Schließen, wenn man außerhalb klickt
                document.addEventListener('click', (e) => {
                    if (!sidebar.contains(e.target) && sidebar.classList.contains('open')) {
                        sidebar.classList.remove('open');
                    }
                });
            }
        }, 100);
    }

    render() {
        this.innerHTML = `
        <button id="mobileMenuBtn" class="mobile-nav-toggle">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        </button>

        <link rel="stylesheet" href="/CMS_Verein/public/styles/sidebar.css">
        <div class="sidebar">
            <div class="sidebar-header">
                <h3>Navigation</h3>
            </div>
            <ul class="sidebar-nav">
                <li><a href="/CMS_Verein/public/admin/dashboard.html">Home</a></li>
                <li><a href="/CMS_Verein/public/admin/guestbook.html">Gästebuch</a></li>
                <li><a href="/CMS_Verein/public/admin/calendar.html">Kalender</a></li>
                <li><a href="/CMS_Verein/public/admin/members.html">Mitglieder</a></li>
            </ul>
            <div class="sidebar-footer">
                <button class="Btn" onclick="logout()">
                    <div class="sign">
                        <svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg>
                    </div>
                    <div class="text">Logout</div>
                </button>
            </div>
        </div>
        `;
    }
}

function logout() {
    window.location.href = "/CMS_Verein/index.html";
}

customElements.define('app-sidebar', AppSidebar);