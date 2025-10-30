/* ============================================
   INIT - Initialisation de l'application
   ============================================ */

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    loadTheme();
    if (gamesData.length === 0) {
        addGameExample();
    }
    renderGames();
    updateStats();
});
