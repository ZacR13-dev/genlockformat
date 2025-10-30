/* ============================================
   SAVE IMPORTER - Gestion de l'import des fichiers .sav
   Utilise PKHeX Backend pour supporter toutes les générations
   ============================================ */

/**
 * Importe un fichier de sauvegarde Pokémon (.sav)
 * @param {Event} event - L'événement de changement du fichier
 */
function importSaveFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Extensions supportées
    const validExtensions = ['.sav', '.dst', '.dsv', '.sa1', '.0', '.dat'];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some(ext => fileName.endsWith(ext));
    
    if (!isValid) {
        alert('⚠️ Extensions supportées: .sav, .dst, .dsv, .sa1, .0, .dat\n' +
              'Émulateurs: VBA, DeSmuME, NO$GBA, Citra, etc.');
        return;
    }

    console.log('📂 Chargement du fichier:', file.name, `(${file.size} bytes)`);

    const reader = new FileReader();
    
    reader.onload = async function(e) {
        try {
            const arrayBuffer = e.target.result;
            
            // Détecter le type de save
            const saveInfo = detectSaveType(arrayBuffer);
            console.log('🎮 Type de save détecté:', saveInfo);
            
            // Parser la save (async maintenant pour supporter le backend API)
            const saveData = await parseSaveFile(arrayBuffer, file);
            console.log('✅ Save parsée:', saveData);
            
            // Afficher une modal de confirmation avec les informations
            showSaveImportModal(saveData, file.name);
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'import:', error);
            alert(`❌ Erreur lors de l'import de la save:\n${error.message}`);
        }
    };
    
    reader.onerror = function() {
        alert('❌ Erreur lors de la lecture du fichier');
    };
    
    reader.readAsArrayBuffer(file);
    
    // Réinitialiser l'input pour permettre de réimporter le même fichier
    event.target.value = '';
}

/**
 * Affiche une modal de confirmation pour l'import de la save
 * @param {Object} saveData - Les données parsées de la save
 * @param {string} fileName - Le nom du fichier
 */
function showSaveImportModal(saveData, fileName) {
    const { saveInfo, team, partyCount, player } = saveData;
    
    // Créer le contenu de la modal
    let modalContent = `
        <div class="save-import-preview">
            <h3>📦 Import de sauvegarde</h3>
            <div class="save-info">
                <p><strong>Fichier:</strong> ${fileName}</p>
                <p><strong>Jeu:</strong> ${saveInfo.game}</p>
                <p><strong>Génération:</strong> ${saveInfo.generation}</p>
                <p><strong>Pokémon dans l'équipe:</strong> ${partyCount}</p>
    `;
    
    // Ajouter les infos du joueur si disponibles
    if (player) {
        modalContent += `
            <div class="player-info">
                <h4>👤 Informations du joueur</h4>
                ${player.name ? `<p><strong>Nom:</strong> ${player.name}</p>` : ''}
                ${player.money !== undefined ? `<p><strong>Argent:</strong> ${player.money} ₽</p>` : ''}
                ${player.badgeCount !== undefined ? `<p><strong>Badges:</strong> ${player.badgeCount}/8</p>` : ''}
                ${player.playTime ? `<p><strong>Temps de jeu:</strong> ${player.playTime.formatted}</p>` : ''}
            </div>
        `;
    }
    
    modalContent += `
            </div>
            <div class="team-preview">
                <h4>🎯 Équipe Pokémon</h4>
                <div class="pokemon-grid">
    `;
    
    // Afficher les Pokémon de l'équipe
    team.forEach(pokemon => {
        const hpPercent = (pokemon.hp / pokemon.maxHp * 100).toFixed(0);
        const hpColor = pokemon.isAlive ? (hpPercent > 50 ? '#4CAF50' : '#FF9800') : '#F44336';
        
        // Utiliser la PokeAPI pour les sprites
        const spriteUrl = window.PokeAPI ? window.PokeAPI.getPokemonSpriteUrl(pokemon.number) : pokemon.sprite;
        
        modalContent += `
            <div class="pokemon-preview-card ${!pokemon.isAlive ? 'dead' : ''}">
                <img src="${spriteUrl}" alt="${pokemon.name}" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png'">
                <div class="pokemon-preview-info">
                    <strong>${pokemon.name}</strong>
                    <span>Niv. ${pokemon.level}</span>
                    <div class="hp-bar-mini">
                        <div class="hp-fill" style="width: ${hpPercent}%; background: ${hpColor}"></div>
                    </div>
                    <span class="hp-text">${pokemon.hp}/${pokemon.maxHp} HP</span>
                    ${!pokemon.isAlive ? '<span class="status-dead">💀 K.O.</span>' : ''}
                </div>
            </div>
        `;
    });
    
    modalContent += `
                </div>
            </div>
            <div class="import-options">
                <h4>⚙️ Options d'import</h4>
                <label>
                    <input type="checkbox" id="importAsNewGame" checked>
                    Créer un nouveau jeu avec cette équipe
                </label>
                <label>
                    <input type="checkbox" id="importOnlyAlive" checked>
                    Importer uniquement les Pokémon vivants
                </label>
            </div>
            <div class="modal-actions">
                <button class="btn btn-success" onclick="confirmSaveImport(${JSON.stringify(saveData).replace(/"/g, '&quot;')})">
                    ✅ Importer
                </button>
                <button class="btn btn-secondary" onclick="closeSaveImportModal()">
                    ❌ Annuler
                </button>
            </div>
        </div>
    `;
    
    // Afficher dans une modal
    const modal = document.createElement('div');
    modal.id = 'saveImportModal';
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h2>🎮 Import de Sauvegarde Pokémon</h2>
                <button class="modal-close" onclick="closeSaveImportModal()">×</button>
            </div>
            <div class="modal-body">
                ${modalContent}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

/**
 * Confirme et effectue l'import de la save
 * @param {Object} saveDataParam - Les données de la save
 */
function confirmSaveImport(saveDataParam) {
    const importAsNewGame = document.getElementById('importAsNewGame')?.checked ?? true;
    const importOnlyAlive = document.getElementById('importOnlyAlive')?.checked ?? true;
    
    try {
        if (importAsNewGame) {
            // Créer un nouveau jeu
            const gameInfo = {
                id: Date.now(),
                name: `${saveDataParam.saveInfo.game}${saveDataParam.player?.name ? ` - ${saveDataParam.player.name}` : ''}`,
                image: getGameImageForGeneration(saveDataParam.saveInfo.generation),
                gen: saveDataParam.saveInfo.generation,
                maxDex: getMaxDexForGeneration(saveDataParam.saveInfo.generation),
                spriteFolder: getSpriteFolderForGeneration(saveDataParam.saveInfo.generation),
                champions: [],
                retired: [],
                dead: [],
                importedFrom: saveDataParam.saveInfo.game,
                importDate: new Date().toISOString()
            };
            
            // Ajouter les Pokémon
            saveDataParam.team.forEach(pokemon => {
                // Utiliser la PokeAPI pour les sprites
                const spriteUrl = window.PokeAPI ? window.PokeAPI.getPokemonSpriteUrl(pokemon.number) : pokemon.sprite;
                const allSprites = window.PokeAPI ? window.PokeAPI.getAllPokemonSprites(pokemon.number) : null;
                
                if (importOnlyAlive && !pokemon.isAlive) {
                    // Ajouter aux morts
                    gameInfo.dead.push({
                        number: pokemon.number,
                        name: pokemon.name,
                        level: pokemon.level,
                        sprite: spriteUrl,
                        sprites: allSprites,
                        deathDate: pokemon.importDate
                    });
                } else if (pokemon.isAlive) {
                    // Ajouter aux champions
                    gameInfo.champions.push({
                        number: pokemon.number,
                        name: pokemon.name,
                        level: pokemon.level,
                        sprite: spriteUrl,
                        sprites: allSprites,
                        hp: pokemon.hp,
                        maxHp: pokemon.maxHp,
                        stats: pokemon.stats,
                        moves: pokemon.moves,
                        exp: pokemon.exp
                    });
                }
            });
            
            // Ajouter le jeu aux données
            gamesData.push(gameInfo);
            
            // Sauvegarder et rafraîchir (appel de la fonction globale saveData)
            if (typeof saveData === 'function') {
                saveData();
            } else if (typeof window.saveData === 'function') {
                window.saveData();
            }
            renderGames();
            updateStats();
            
            closeSaveImportModal();
            showNotification(`✅ ${gameInfo.name} importé avec succès!`, 'success');
            
            console.log('✅ Jeu importé:', gameInfo);
        }
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'import:', error);
        alert(`❌ Erreur: ${error.message}`);
    }
}

/**
 * Ferme la modal d'import
 */
function closeSaveImportModal() {
    const modal = document.getElementById('saveImportModal');
    if (modal) {
        modal.remove();
    }
}

/**
 * Obtient l'image du jeu selon la génération
 */
function getGameImageForGeneration(gen) {
    const images = {
        1: 'image-jeu/pokemon_jaune.png',
        2: 'image-jeu/pokemon_cristal.png',
        3: 'image-jeu/pokemon_emeraude.png',
        4: 'image-jeu/pokemon_platine.jpg',
        5: 'image-jeu/pokemon_noir.jpg',
        6: 'image-jeu/pokemon_x.jpg',
        7: 'image-jeu/pokemon_lune.jpg'
    };
    return images[gen] || '';
}

/**
 * Obtient le nombre max de Pokémon selon la génération
 */
function getMaxDexForGeneration(gen) {
    const maxDex = {
        1: 151,
        2: 251,
        3: 386,
        4: 493,
        5: 649,
        6: 721,
        7: 809,
        8: 898
    };
    return maxDex[gen] || 151;
}

/**
 * Obtient le dossier de sprites selon la génération
 */
function getSpriteFolderForGeneration(gen) {
    const folders = {
        1: 'Gen1/yellow',
        2: 'Gen2/crystal',
        3: 'Gen3/Gen3/emerald',
        4: 'Gen4/platinum',
        5: 'Gen5',
        6: 'Gen6/x-y',
        7: 'Gen7/sun-moon'
    };
    return folders[gen] || 'Gen1/yellow';
}
