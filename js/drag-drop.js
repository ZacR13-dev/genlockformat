/* ============================================
   DRAG & DROP - Gestion du glisser-déposer
   ============================================ */

// Début du drag
function handleDragStart(e, gameId, section, pokemon) {
    draggedElement = e.target;
    draggedPokemon = pokemon;
    sourceGameId = gameId;
    sourceSection = section;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

// Fin du drag
function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    draggedElement = null;
    draggedPokemon = null;
    sourceGameId = null;
    sourceSection = null;
}

// Survol d'une zone de drop
function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
}

// Autoriser le drop
function allowDrop(event) {
    event.preventDefault();
}

// Drop du Pokémon
function handleDrop(e, targetGameId, targetSection) {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedPokemon || !sourceGameId || !sourceSection) {
        return false;
    }

    const targetGame = gamesData.find(g => g.id === targetGameId);
    
    // Vérifier la limite de 6 champions
    if (targetSection === 'champions' && targetGame && targetGame.champions.length >= 6) {
        if (!(sourceGameId === targetGameId && sourceSection === 'champions')) {
            showNotification('⚠️ Team full! Maximum 6 champions.', 'warning');
            return false;
        }
    }

    // Retirer le Pokémon de la source
    const sourceGame = gamesData.find(g => g.id === sourceGameId);
    if (sourceGame) {
        sourceGame[sourceSection] = sourceGame[sourceSection].filter(p => p.id !== draggedPokemon.id);
    }

    // Ajouter le Pokémon à la cible
    if (targetGame) {
        if (targetSection === 'dead') {
            // Synchroniser avec tous les jeux
            gamesData.forEach(game => {
                game.champions = game.champions.filter(p => p.name !== draggedPokemon.name);
                game.retired = game.retired.filter(p => p.name !== draggedPokemon.name);
                
                if (!game.dead.find(p => p.name === draggedPokemon.name)) {
                    game.dead.push({
                        id: Date.now() + Math.random(),
                        name: draggedPokemon.name,
                        number: draggedPokemon.number,
                        sprite: draggedPokemon.sprite
                    });
                }
            });
        } else {
            targetGame[targetSection].push(draggedPokemon);
        }
    }

    renderGames();
    updateStats();
    saveData();
    return false;
}
