/* ============================================
   TABS - Gestion des onglets
   ============================================ */

// Changer d'onglet
function switchTab(tabName) {
    // Retirer la classe active de tous les onglets
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Ajouter la classe active à l'onglet sélectionné
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}Tab`).classList.add('active');
    
    // Rafraîchir les données si on ouvre l'onglet stats
    if (tabName === 'stats') {
        renderDashboard();
    }
}
