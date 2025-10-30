/* ============================================
   POKEMON - Gestion des Pokémon
   ============================================ */

// Ouvrir le modal pour ajouter un Pokémon
function addPokemon(gameId, section) {
    currentGameId = gameId;
    currentSection = section;
    
    const modal = document.getElementById('addPokemonModal');
    const pokemonSelection = document.getElementById('pokemonSelection');
    const searchInput = document.getElementById('pokemonSearch');
    
    // Trouver le jeu pour connaître sa génération
    const game = gamesData.find(g => g.id === gameId);
    let maxDex = 251;
    if (game) {
        console.log('Game data:', game);
        if (game.maxDex) {
            maxDex = game.maxDex;
        } else if (game.gen) {
            const genMaxDex = { 1: 151, 2: 251, 3: 386 };
            maxDex = genMaxDex[game.gen] || 251;
        }
    }
    console.log('MaxDex utilisé:', maxDex);
    
    // Générer la grille des Pokémon disponibles
    renderPokemonSelection('', maxDex);
    
    // Ajouter la recherche
    searchInput.value = '';
    searchInput.oninput = () => {
        const search = searchInput.value.toLowerCase();
        renderPokemonSelection(search, maxDex);
    };
    
    modal.classList.add('active');
}

// Fermer le modal Pokémon
function closePokemonModal() {
    document.getElementById('addPokemonModal').classList.remove('active');
    currentGameId = null;
    currentSection = null;
}

// Rendre la grille de sélection Pokémon
function renderPokemonSelection(search = '', maxDex = 251) {
    const pokemonSelection = document.getElementById('pokemonSelection');
    const game = gamesData.find(g => g.id === currentGameId);
    
    // ✅ Utilise PokemonData au lieu de pokemonGen1
    const allPokemon = typeof PokemonData !== 'undefined' ? PokemonData.names.fr : (window.pokemonNames || {});
    const filteredPokemon = Object.entries(allPokemon).filter(([num, name]) => {
        const pokemonNum = parseInt(num);
        if (pokemonNum > maxDex) return false;
        if (!search) return true;
        const translatedName = translatePokemonName(pokemonNum, name);
        return translatedName.toLowerCase().includes(search) || name.toLowerCase().includes(search) || num.includes(search);
    });
    
    pokemonSelection.innerHTML = filteredPokemon.map(([num, name]) => {
        const pokemonNum = parseInt(num);
        const translatedName = translatePokemonName(pokemonNum, name);
        // Utiliser la PokeAPI pour les sprites
        const spriteUrl = window.PokeAPI ? window.PokeAPI.getPokemonSpriteUrl(pokemonNum) : `Gen1/yellow/${num.padStart(4, '0')}.png`;
        
        return `
            <div class="pokemon-option" onclick="selectPokemon(${num}, '${name}')">
                <img src="${spriteUrl}" alt="${translatedName}" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png'">
                <div class="pokemon-option-number">#${num}</div>
                <div class="pokemon-option-name">${translatedName}</div>
            </div>
        `;
    }).join('');
}

// Sélectionner un Pokémon
function selectPokemon(number, name) {
    const game = gamesData.find(g => g.id === currentGameId);
    if (!game) return;
    
    // Vérifier si le Pokémon existe déjà
    const allPokemonInGame = [...game.champions, ...game.retired, ...game.dead];
    const alreadyExists = allPokemonInGame.some(p => p.number === number);
    
    if (alreadyExists) {
        showNotification(`⚠️ ${t('notifications.alreadyInGame', {name})}`, 'warning');
        return;
    }
    
    // Vérifier la limite de 6 champions
    if (currentSection === 'champions' && game.champions.length >= 6) {
        showNotification(`⚠️ ${t('notifications.teamFull')}`, 'warning');
        return;
    }
    
    // Utiliser la PokeAPI pour le sprite
    const spriteUrl = window.PokeAPI ? window.PokeAPI.getPokemonSpriteUrl(number) : `Gen1/yellow/${String(number).padStart(4, '0')}.png`;
    
    game[currentSection].push({
        id: Date.now() + Math.random(),
        name: name,
        number: number,
        sprite: spriteUrl,
        // Stocker aussi toutes les variantes de sprites
        sprites: window.PokeAPI ? window.PokeAPI.getAllPokemonSprites(number) : null
    });
    
    closePokemonModal();
    renderGames();
    updateStats();
    saveData();
    showNotification(`✓ ${name} added!`, 'success');
}

// Supprimer un Pokémon
function deletePokemon(gameId, section, pokemonId) {
    const game = gamesData.find(g => g.id === gameId);
    if (game) {
        game[section] = game[section].filter(p => p.id !== pokemonId);
        renderGames();
        updateStats();
        saveData();
    }
}
