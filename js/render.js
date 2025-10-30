/* ============================================
   RENDER - Rendu de l'interface
   ============================================ */

// Rendu des jeux
function renderGames() {
    const container = document.getElementById('gamesContainer');
    container.innerHTML = '';
    
    if (gamesData.length === 0) {
        container.innerHTML = '<div style="padding: 40px; text-align: center; color: #586069;">Aucun jeu ajouté. Cliquez sur "➕ Ajouter un jeu" pour commencer.</div>';
        return;
    }

    gamesData.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.innerHTML = `
            <div class="game-header">
                <button class="remove-game" onclick="removeGame(${game.id})" title="Supprimer">×</button>
                ${game.image ? `<img src="${game.image}" alt="${game.name}" class="game-cover">` : ''}
                <h2>${game.name}</h2>
            </div>
            <div class="game-sections">
                ${renderSection(game, 'champions', '🏆')}
                ${renderSection(game, 'retired', '📦')}
                ${renderSection(game, 'dead', '💀')}
            </div>
        `;
        container.appendChild(gameCard);
    });
}

// Rendu d'une section (champions, retired, dead)
function renderSection(game, section, icon) {
    const sectionData = game[section];
    const maxChampions = section === 'champions' ? '/6' : '';
    
    return `
        <div class="section" data-section="${section}" ondrop="handleDrop(event, ${game.id}, '${section}')" ondragover="allowDrop(event)">
            <h3>${icon} ${t('sections.' + section)} (${sectionData.length}${maxChampions})</h3>
            <div class="pokemon-list">
                ${sectionData.map(p => renderPokemonItem(game.id, section, p)).join('')}
            </div>
            ${section === 'champions' && sectionData.length >= 6 ? '' : `<button class="add-btn" onclick="addPokemon(${game.id}, '${section}')">${t('btn.add')}</button>`}
        </div>
    `;
}

// Rendu d'un item Pokémon
function renderPokemonItem(gameId, section, p) {
    const translatedName = translatePokemonName(p.number, p.name);
    const levelInfo = p.level ? `<span class="pokemon-level">Niv. ${p.level}</span>` : '';
    const hpInfo = p.hp !== undefined ? `<span class="pokemon-hp">❤️ ${p.hp}/${p.maxHp}</span>` : '';
    const detailsBtn = p.level ? `<button class="details-btn" onclick="showPokemonDetails(${gameId}, '${section}', ${p.id})" title="Détails">ℹ️</button>` : '';
    const deadClass = section === 'dead' ? ' dead' : '';
    
    return `
        <div class="pokemon-item${deadClass}" draggable="true" ondragstart="handleDragStart(event, ${gameId}, '${section}', ${p.id})">
            <img src="${p.sprite}" alt="${translatedName}" onerror="this.style.display='none'">
            <div class="pokemon-info">
                <span class="pokemon-name">${translatedName}</span>
                <div class="pokemon-stats-inline">
                    ${levelInfo}
                    ${hpInfo}
                </div>
            </div>
            ${detailsBtn}
            <button class="delete-btn" onclick="deletePokemon(${gameId}, '${section}', ${p.id})">×</button>
        </div>
    `;
}

// Mise à jour des statistiques
function updateStats() {
    document.getElementById('totalGames').textContent = gamesData.length;
    
    let totalChampions = 0;
    let totalRetired = 0;
    let totalDead = 0;

    gamesData.forEach(game => {
        totalChampions += game.champions.length;
        totalRetired += game.retired.length;
        totalDead += game.dead.length;
    });

    document.getElementById('totalChampions').textContent = totalChampions;
    document.getElementById('totalRetired').textContent = totalRetired;
    document.getElementById('totalDead').textContent = totalDead;
}
