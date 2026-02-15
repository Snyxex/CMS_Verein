class AppSidebar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
        <link rel="stylesheet" href="/CMS_Verein/public/styles/sidebar.css">
            <div class="sidebar">
                <div class="sidebar-header">
                    <h3>Navigation</h3>
                </div>
                <ul class="sidebar-nav">
                    <li><a href="index.html"><i class="icon-home"></i> Home</a></li>
                    <li><a href="guestbook.html"><i class="icon-book"></i> Gästebuch</a></li>
                    <li><a href="calendar.html"><i class="icon-calendar"></i> Kalender</a></li>
                    <li><a href="members.html"><i class="icon-user"></i> Mitglieder</a></li>
                </ul>
                <div class="sidebar-footer">
                   
                </div>
            </div>
        `;
    }
}

customElements.define('app-sidebar', AppSidebar);