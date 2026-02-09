class AppFooter extends HTMLElement{
    connectedCallback(){
        this.innerHTML = `
        <link rel="stylesheet" href="/CMS_Verein/public/styles/footer.css">
        <footer class="footer">
    <div class="footer-top">
        <div class="footer-column">
            <h3>Top Kategorien</h3>
            <ul>
                <li><a href="./public/footer/hometrikot.html">Home Trikot</a></li>
                <li><a href="public/footer/awaytrikot.html">Away Trikot</a></li>
                <li><a href="./public/footer/Torwarttrikot.html">Torwart Trikot</a></li>
            </ul>
        </div>

        <div class="footer-column">
            <h3>Hilfe & Services</h3>
            <ul>
                <li><a href="./public/footer/Kontakt.html">Kontakt</a></li>
            </ul>
        </div>

        <div class="footer-column">
            <h3>Folge uns</h3>
            <div class="social-icons">
                <a href="#">YouTube</a>
                <a href="https://www.instagram.com/">Instagram</a>
                <a href="https://github.com/Snyxex/CMS_Verein">Github</a>
            </div>
        </div>
    </div>

    <div class="footer-bottom">
        <p>© 2026 Dein Verein e.V.</p>
        <div class="footer-links">
            <a href="./public/footer/impressum.html">Impressum</a>
            <a href="./public/footer/Datenschutz.html">Datenschutz</a>

        </div>
    </div>
</footer>
        `;
    }
};

customElements.define("app-footer",AppFooter);