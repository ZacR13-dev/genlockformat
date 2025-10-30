/* ============================================
   GAMES - Gestion des jeux
   ============================================ */

// Ouvrir le modal pour ajouter un jeu
function addGame() {
    const modal = document.getElementById('addGameModal');
    const gameSelection = document.getElementById('gameSelection');
    
    // Générer la grille de sélection
    gameSelection.innerHTML = availableGames.map((game, index) => `
        <div class="game-option" onclick="selectGame(${index})">
            <img src="${game.image}" alt="${game.name}">
            <div class="game-option-name">${game.name}</div>
        </div>
    `).join('');
    
    modal.classList.add('active');
}

// Fermer le modal
function closeModal() {
    document.getElementById('addGameModal').classList.remove('active');
}

// Sélectionner un jeu
function selectGame(gameIndex) {
    const gameInfo = availableGames[gameIndex];
    gamesData.push({
        id: Date.now(),
        name: gameInfo.name,
        image: gameInfo.image,
        gen: gameInfo.gen,
        maxDex: gameInfo.maxDex,
        spriteFolder: gameInfo.spriteFolder,
        champions: [],
        retired: [],
        dead: []
    });

    closeModal();
    renderGames();
    updateStats();
    saveData();
}

// Supprimer un jeu
function removeGame(gameId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce jeu ?')) {
        gamesData = gamesData.filter(game => game.id !== gameId);
        renderGames();
        updateStats();
        saveData();
    }
}

// Ajouter un jeu exemple
function addGameExample() {
    gamesData.push({
        id: Date.now(),
        name: 'Pokémon Jaune',
        image: '',
        champions: [],
        retired: [],
        dead: []
    });
}
