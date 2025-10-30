/* ============================================
   THEME - Gestion du thème clair/sombre
   ============================================ */

// Basculer entre thème clair et sombre
function toggleTheme() {
    const body = document.body;
    const icon = document.getElementById('themeIcon');
    
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        icon.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.add('dark-mode');
        icon.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    }
}

// Charger le thème sauvegardé
function loadTheme() {
    const theme = localStorage.getItem('theme');
    const icon = document.getElementById('themeIcon');
    
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        icon.textContent = '☀️';
    } else {
        icon.textContent = '🌙';
    }
}
