/* ============================================
   STORAGE - Gestion du localStorage
   ============================================ */

// Sauvegarder les données dans localStorage
function saveData() {
    try {
        localStorage.setItem('genlockData', JSON.stringify(gamesData));
        showNotification('✅ Data saved!');
    } catch (error) {
        alert('Save error: ' + error.message);
    }
}

// Charger les données depuis localStorage
function loadData() {
    try {
        const saved = localStorage.getItem('genlockData');
        if (saved) {
            gamesData = JSON.parse(saved);
            
            // Migration : ajouter gen et maxDex aux anciens jeux
            let needsSave = false;
            gamesData.forEach(game => {
                if (!game.gen || !game.maxDex) {
                    const gameName = game.name.toLowerCase();
                    if (gameName.includes('jaune') || gameName.includes('yellow') || 
                        gameName.includes('rouge') || gameName.includes('red') || 
                        gameName.includes('bleu') || gameName.includes('blue')) {
                        game.gen = 1;
                        game.maxDex = 151;
                        if (!game.spriteFolder) game.spriteFolder = 'Gen1/yellow';
                        needsSave = true;
                    } else if (gameName.includes('cristal') || gameName.includes('crystal') || 
                               gameName.includes('or') || gameName.includes('gold') || 
                               gameName.includes('argent') || gameName.includes('silver')) {
                        game.gen = 2;
                        game.maxDex = 251;
                        if (!game.spriteFolder) game.spriteFolder = 'Gen2/crystal';
                        needsSave = true;
                    } else if (gameName.includes('émeraude') || gameName.includes('emerald') || 
                               gameName.includes('rubis') || gameName.includes('ruby') || 
                               gameName.includes('saphir') || gameName.includes('sapphire')) {
                        game.gen = 3;
                        game.maxDex = 386;
                        if (!game.spriteFolder) game.spriteFolder = 'Gen3/Gen3/emerald';
                        needsSave = true;
                    }
                }
            });
            
            if (needsSave) {
                console.log('Migration des données effectuée');
                saveData();
            }
        }
    } catch (error) {
        console.error('Erreur lors du chargement:', error);
    }
}

// Export des données en JSON
function exportData() {
    const dataStr = JSON.stringify(gamesData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `genlock-save-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('📤 Data exported!');
}

// Import des données depuis un fichier JSON
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            if (confirm('Voulez-vous remplacer les données actuelles ?')) {
                gamesData = imported;
                renderGames();
                updateStats();
                saveData();
                showNotification('📥 Data imported!', 'success');
            }
        } catch (error) {
            alert('Import error: invalid file');
        }
    };
    reader.readAsText(file);
}

// Réinitialiser toutes les données
function resetAll() {
    if (confirm('⚠️ Êtes-vous sûr de vouloir tout réinitialiser ? Cette action est irréversible !')) {
        if (confirm('Dernière confirmation : toutes les données seront perdues !')) {
            gamesData = [];
            localStorage.removeItem('genlockData');
            renderGames();
            updateStats();
            showNotification('🔄 Data reset');
        }
    }
}
