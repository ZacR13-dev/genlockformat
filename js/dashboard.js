/* ============================================
   DASHBOARD - Statistiques et analytics
   ============================================ */

// Calculer et afficher le dashboard
function renderDashboard() {
    const stats = calculateStats();
    
    // Mettre à jour les cartes overview
    document.getElementById('dashTotalGames').textContent = stats.totalGames;
    document.getElementById('dashTotalChampions').textContent = stats.totalChampions;
    document.getElementById('dashTotalDead').textContent = stats.totalDead;
    document.getElementById('dashSurvivalRate').textContent = stats.survivalRate + '%';
    
    // Afficher les différentes sections
    renderStatsByGen(stats.byGeneration);
    renderTopPokemon(stats.topPokemon);
    renderHallOfFame(stats.hallOfFame);
    renderFallenHeroes(stats.fallenHeroes);
}

// Calculer toutes les statistiques
function calculateStats() {
    let totalGames = gamesData.length;
    let totalChampions = 0;
    let totalRetired = 0;
    let totalDead = 0;
    
    const byGeneration = {};
    const pokemonCount = {};
    const pokemonInGames = {};
    const deadPokemon = new Set();
    
    gamesData.forEach(game => {
        totalChampions += game.champions.length;
        totalRetired += game.retired.length;
        totalDead += game.dead.length;
        
        // Stats par génération
        const gen = game.gen || 1;
        if (!byGeneration[gen]) {
            byGeneration[gen] = { champions: 0, retired: 0, dead: 0, total: 0 };
        }
        byGeneration[gen].champions += game.champions.length;
        byGeneration[gen].retired += game.retired.length;
        byGeneration[gen].dead += game.dead.length;
        byGeneration[gen].total += game.champions.length + game.retired.length + game.dead.length;
        
        // Compter les Pokémon
        [...game.champions, ...game.retired, ...game.dead].forEach(p => {
            const key = p.name;
            pokemonCount[key] = (pokemonCount[key] || 0) + 1;
            
            if (!pokemonInGames[key]) {
                pokemonInGames[key] = {
                    games: [],
                    sprite: p.sprite,
                    number: p.number
                };
            }
            if (!pokemonInGames[key].games.includes(game.name)) {
                pokemonInGames[key].games.push(game.name);
            }
        });
        
        // Ajouter les morts
        game.dead.forEach(p => {
            deadPokemon.add(JSON.stringify({ name: p.name, sprite: p.sprite, number: p.number }));
        });
    });
    
    // Taux de survie
    const totalPokemon = totalChampions + totalRetired + totalDead;
    const survivalRate = totalPokemon > 0 ? Math.round(((totalChampions + totalRetired) / totalPokemon) * 100) : 0;
    
    // Top 10 Pokémon
    const topPokemon = Object.entries(pokemonCount)
        .map(([name, count]) => ({
            name,
            count,
            games: pokemonInGames[name].games,
            sprite: pokemonInGames[name].sprite,
            number: pokemonInGames[name].number
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    
    // Hall of Fame
    const championsByPokemon = {};
    gamesData.forEach(game => {
        game.champions.forEach(p => {
            if (!championsByPokemon[p.name]) {
                championsByPokemon[p.name] = {
                    games: [],
                    sprite: p.sprite,
                    number: p.number
                };
            }
            championsByPokemon[p.name].games.push(game.name);
        });
    });
    
    const hallOfFame = Object.entries(championsByPokemon)
        .filter(([name, data]) => data.games.length >= 2)
        .map(([name, data]) => ({
            name,
            gamesCount: data.games.length,
            games: data.games,
            sprite: data.sprite,
            number: data.number
        }))
        .sort((a, b) => b.gamesCount - a.gamesCount);
    
    // Fallen Heroes
    const fallenHeroes = Array.from(deadPokemon).map(str => JSON.parse(str));
    
    return {
        totalGames,
        totalChampions,
        totalRetired,
        totalDead,
        survivalRate,
        byGeneration,
        topPokemon,
        hallOfFame,
        fallenHeroes
    };
}

// Afficher les stats par génération
function renderStatsByGen(byGeneration) {
    const container = document.getElementById('statsByGen');
    
    if (Object.keys(byGeneration).length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📊</div><div class="empty-state-text">Aucune donnée disponible</div></div>';
        return;
    }
    
    container.innerHTML = Object.entries(byGeneration)
        .sort(([a], [b]) => parseInt(a) - parseInt(b))
        .map(([gen, stats]) => {
            const survivalRate = stats.total > 0 ? Math.round(((stats.champions + stats.retired) / stats.total) * 100) : 0;
            return `
                <div class="gen-stat-row">
                    <div class="gen-stat-label">Gen ${gen}</div>
                    <div class="gen-stat-bar">
                        <div class="gen-stat-fill" style="width: ${survivalRate}%">
                            ${survivalRate}%
                        </div>
                    </div>
                    <div class="gen-stat-numbers">
                        <div class="gen-stat-item">
                            <span class="label">🏆</span>
                            <span class="value">${stats.champions}</span>
                        </div>
                        <div class="gen-stat-item">
                            <span class="label">📦</span>
                            <span class="value">${stats.retired}</span>
                        </div>
                        <div class="gen-stat-item">
                            <span class="label">💀</span>
                            <span class="value">${stats.dead}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
}

// Afficher le top 10 des Pokémon
function renderTopPokemon(topPokemon) {
    const container = document.getElementById('topPokemon');
    
    if (topPokemon.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">⭐</div><div class="empty-state-text">Aucun Pokémon utilisé</div></div>';
        return;
    }
    
    container.innerHTML = topPokemon.map((pokemon, index) => {
        const translatedName = translatePokemonName(pokemon.number, pokemon.name);
        return `
            <div class="top-pokemon-item">
                <div class="top-pokemon-rank">#${index + 1}</div>
                <img src="${pokemon.sprite}" alt="${translatedName}" class="top-pokemon-sprite" onerror="this.style.display='none'">
                <div class="top-pokemon-info">
                    <div class="top-pokemon-name">${translatedName}</div>
                    <div class="top-pokemon-games">${pokemon.games.join(', ')}</div>
                </div>
                <div class="top-pokemon-count">${pokemon.count}</div>
            </div>
        `;
    }).join('');
}

// Afficher le Hall of Fame
function renderHallOfFame(hallOfFame) {
    const container = document.getElementById('hallOfFame');
    
    if (hallOfFame.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🏆</div><div class="empty-state-text">Aucun Pokémon n\'a survécu dans plusieurs jeux</div></div>';
        return;
    }
    
    container.innerHTML = hallOfFame.map(pokemon => {
        const translatedName = translatePokemonName(pokemon.number, pokemon.name);
        return `
            <div class="hall-pokemon">
                <img src="${pokemon.sprite}" alt="${translatedName}" class="hall-pokemon-sprite" onerror="this.style.display='none'">
                <div class="hall-pokemon-name">${translatedName}</div>
                <div class="hall-pokemon-games">${pokemon.games.join(', ')}</div>
                <div class="hall-pokemon-badge">${pokemon.gamesCount} jeux</div>
            </div>
        `;
    }).join('');
}

// Afficher les Fallen Heroes
function renderFallenHeroes(fallenHeroes) {
    const container = document.getElementById('fallenHeroes');
    
    if (fallenHeroes.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">💀</div><div class="empty-state-text">Aucun Pokémon tombé au combat (pour l\'instant...)</div></div>';
        return;
    }
    
    container.innerHTML = fallenHeroes.map(pokemon => {
        const translatedName = translatePokemonName(pokemon.number, pokemon.name);
        return `
            <div class="fallen-pokemon">
                <img src="${pokemon.sprite}" alt="${translatedName}" class="fallen-pokemon-sprite" onerror="this.style.display='none'">
                <div class="fallen-pokemon-name">${translatedName}</div>
            </div>
        `;
    }).join('');
}
