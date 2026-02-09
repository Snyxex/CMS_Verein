document.addEventListener("DOMContentLoaded", () => {
    const commentList = document.getElementById("commentList");

    async function loadComments() {
        try {
            const response = await fetch('/CMS_Verein/src/db/query/get/getPosts.php');
            
            if (!response.ok) {
                throw new Error(`HTTP-Fehler! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.length === 0) {
                commentList.innerHTML = "<p>Noch keine Einträge vorhanden. Sei der Erste!</p>";
                return;
            }

            // Wir setzen die Variablen (c.name, c.message) jetzt direkt ein
            commentList.innerHTML = data.map(c => `
                <div class="comment-entry-item" style="border-bottom: 1px solid #eee; padding: 15px; margin-bottom: 10px; background: #f9f9f9; border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between;">
                        <strong style="color: #2c3e50;">${c.name}</strong>
                        <small style="color: #888;">${new Date(c.created_at).toLocaleString('de-DE')}</small>
                    </div>
                    <p style="margin-top: 10px; color: #444;">${c.message}</p>
                </div>
            `).join('');

        } catch (error) {
            console.error("Fehler beim Laden:", error);
            commentList.innerHTML = "<p style='color: red;'>Fehler beim Laden der Kommentare.</p>";
        }
    }

    loadComments();
});