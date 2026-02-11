<?php 
include 'get/getnews.php'; ?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>News Übersicht</title>
    <link rel="stylesheet" href="../../../public/styles/footer.css">

</head>
<body>
<app-navbar></app-navbar>
<script src="../../components/navbar.js"></script>

    <div class="background"></div>

    <div class="news-container">
        <?php foreach ($news_items as $post): ?>
            <div class="news-item">
                <img src="<?= htmlspecialchars($post['image'] ?? 'placeholder.jpg') ?>" class="news-image">
                <div class="news-date">
                    <small><?= date("d.m.Y", strtotime($post['created_at'])) ?></small>
                    <div class="news-item">
                        <h3><?= htmlspecialchars($post['title']) ?></h3>
                        <p><?= nl2br(htmlspecialchars($post['content'])) ?></p>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
        
        <?php if (empty($news_items)): ?>
            <p>Keine Beiträge gefunden.</p>
        <?php endif; ?>
    </div>

    <div class="pagination">
        <a href="?offset=<?= $offset - 6 ?>">Zurück</a>
        <a href="?offset=<?= $offset + 6 ?>">Weiter</a>
    </div>

    <app-footer></app-footer>
<script src="../../components/footer.js"></script>
</body>
</html>