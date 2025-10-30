/* ============================================
   POKEMON DETAILS - Modal de détails Pokémon
   ============================================ */

// Afficher les détails complets d'un Pokémon
async function showPokemonDetails(gameId, section, pokemonId) {
    const game = gamesData.find(g => g.id === gameId);
    if (!game) return;
    
    const pokemon = game[section].find(p => p.id === pokemonId);
    if (!pokemon || !pokemon.level) {
        showNotification('⚠️ Aucune donnée détaillée disponible', 'warning');
        return;
    }
    
    const translatedName = translatePokemonName(pokemon.number, pokemon.name);
    const hpPercent = Math.round((pokemon.hp / pokemon.maxHp) * 100);
    const hpColor = hpPercent > 50 ? '#2ea44f' : hpPercent > 25 ? '#fb8500' : '#cf222e';
    
    // Récupérer toutes les variantes de sprites
    const sprites = pokemon.sprites || (window.PokeAPI ? window.PokeAPI.getAllPokemonSprites(pokemon.number) : null);
    
    // Récupérer les données complètes depuis la PokeAPI
    let pokemonData = null;
    let speciesData = null;
    if (window.PokeAPI) {
        try {
            pokemonData = await window.PokeAPI.fetchPokemonData(pokemon.number);
            // Récupérer aussi les données d'espèce pour la description et l'évolution
            const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.number}`);
            if (speciesResponse.ok) {
                speciesData = await speciesResponse.json();
            }
        } catch (error) {
            console.warn('Impossible de récupérer les données PokeAPI:', error);
        }
    }
    
    const content = `
        <div class="pokemon-details-header">
            <img src="${pokemon.sprite}" alt="${translatedName}" class="pokemon-details-sprite" onerror="this.style.display='none'">
            <div class="pokemon-details-title">
                <div class="pokemon-details-name">${translatedName}</div>
                <div class="pokemon-details-level">Niveau ${pokemon.level}</div>
            </div>
        </div>
        
        <!-- Informations de base -->
        ${pokemonData ? `
        <div class="pokemon-details-section">
            <h4>📊 Informations de base</h4>
            <div class="pokemon-base-info">
                <div class="base-info-row">
                    <span class="base-info-label">🏷️ Numéro National:</span>
                    <span class="base-info-value">#${String(pokemon.number).padStart(3, '0')}</span>
                </div>
                <div class="base-info-row">
                    <span class="base-info-label">🎨 Type(s):</span>
                    <span class="base-info-value">
                        ${pokemonData.types.map(type => `<span class="type-badge type-${type}">${type.charAt(0).toUpperCase() + type.slice(1)}</span>`).join(' ')}
                    </span>
                </div>
                <div class="base-info-row">
                    <span class="base-info-label">📏 Taille:</span>
                    <span class="base-info-value">${(pokemonData.height / 10).toFixed(1)} m</span>
                </div>
                <div class="base-info-row">
                    <span class="base-info-label">⚖️ Poids:</span>
                    <span class="base-info-value">${(pokemonData.weight / 10).toFixed(1)} kg</span>
                </div>
            </div>
        </div>
        ` : ''}
        
        <!-- Description -->
        ${speciesData && speciesData.flavor_text_entries ? `
        <div class="pokemon-details-section">
            <h4>📖 Description</h4>
            <div class="pokemon-description">
                ${(() => {
                    const frenchEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === 'fr');
                    const englishEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en');
                    const description = frenchEntry || englishEntry;
                    return description ? description.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ') : 'Aucune description disponible';
                })()}
            </div>
        </div>
        ` : ''}
        
        <!-- Galerie de sprites -->
        ${sprites ? `
        <div class="pokemon-details-section">
            <h4>🎨 Galerie de Sprites</h4>
            <div class="pokemon-sprites-gallery">
                <div class="sprite-item">
                    <img src="${sprites.front_default}" alt="Normal" onerror="this.style.display='none'">
                    <span class="sprite-label">Normal</span>
                </div>
                <div class="sprite-item">
                    <img src="${sprites.front_shiny}" alt="Shiny" onerror="this.style.display='none'">
                    <span class="sprite-label">✨ Shiny</span>
                </div>
                <div class="sprite-item">
                    <img src="${sprites.back_default}" alt="Dos" onerror="this.style.display='none'">
                    <span class="sprite-label">Dos</span>
                </div>
                <div class="sprite-item">
                    <img src="${sprites.back_shiny}" alt="Dos Shiny" onerror="this.style.display='none'">
                    <span class="sprite-label">✨ Dos Shiny</span>
                </div>
                ${sprites.official ? `
                <div class="sprite-item sprite-official">
                    <img src="${sprites.official}" alt="Artwork Officiel" onerror="this.style.display='none'">
                    <span class="sprite-label">🎨 Artwork Officiel</span>
                </div>
                ` : ''}
            </div>
        </div>
        ` : ''}
        
        <!-- HP Bar -->
        <div class="pokemon-details-section">
            <h4>❤️ Points de Vie</h4>
            <div style="background: var(--bg-secondary); padding: 15px; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-weight: 600;">${pokemon.hp} / ${pokemon.maxHp}</span>
                    <span style="font-weight: 600; color: ${hpColor};">${hpPercent}%</span>
                </div>
                <div style="height: 20px; background: var(--bg-tertiary); border-radius: 10px; overflow: hidden;">
                    <div style="height: 100%; background: ${hpColor}; width: ${hpPercent}%; transition: width 0.3s ease;"></div>
                </div>
                ${pokemon.status !== 'OK' ? `<div style="margin-top: 8px; color: #fb8500; font-weight: 600;">⚠️ Statut: ${pokemon.status}</div>` : ''}
            </div>
        </div>
        
        <!-- Stats -->
        ${pokemon.stats ? `
        <div class="pokemon-details-section">
            <h4>💪 Statistiques</h4>
            <div class="pokemon-stats-grid">
                <div class="pokemon-stat-item">
                    <span class="pokemon-stat-label">Attaque</span>
                    <span class="pokemon-stat-value">${pokemon.stats.attack || 0}</span>
                </div>
                <div class="pokemon-stat-item">
                    <span class="pokemon-stat-label">Défense</span>
                    <span class="pokemon-stat-value">${pokemon.stats.defense || 0}</span>
                </div>
                <div class="pokemon-stat-item">
                    <span class="pokemon-stat-label">Vitesse</span>
                    <span class="pokemon-stat-value">${pokemon.stats.speed || 0}</span>
                </div>
                ${pokemon.stats.special ? `
                <div class="pokemon-stat-item">
                    <span class="pokemon-stat-label">Spécial</span>
                    <span class="pokemon-stat-value">${pokemon.stats.special}</span>
                </div>
                ` : ''}
                ${pokemon.stats.spAttack ? `
                <div class="pokemon-stat-item">
                    <span class="pokemon-stat-label">Att. Spé.</span>
                    <span class="pokemon-stat-value">${pokemon.stats.spAttack}</span>
                </div>
                ` : ''}
                ${pokemon.stats.spDefense ? `
                <div class="pokemon-stat-item">
                    <span class="pokemon-stat-label">Déf. Spé.</span>
                    <span class="pokemon-stat-value">${pokemon.stats.spDefense}</span>
                </div>
                ` : ''}
            </div>
        </div>
        ` : ''}
        
        <!-- Moves -->
        ${pokemon.moves && pokemon.moves.length > 0 ? `
        <div class="pokemon-details-section">
            <h4>⚔️ Attaques</h4>
            <div class="pokemon-moves-list">
                ${pokemon.moves.map(move => `
                    <div class="move-item">
                        <span class="move-name">${move.name}</span>
                        <span class="move-pp">PP: ${move.pp}</span>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
        
        <!-- IVs -->
        ${pokemon.ivs ? `
        <div class="pokemon-details-section">
            <h4>🧬 IVs (Individual Values)</h4>
            <div class="pokemon-ivs-grid">
                <div class="iv-item">
                    <div class="iv-label">ATK</div>
                    <div class="iv-value">${pokemon.ivs.attack}/15</div>
                </div>
                <div class="iv-item">
                    <div class="iv-label">DEF</div>
                    <div class="iv-value">${pokemon.ivs.defense}/15</div>
                </div>
                <div class="iv-item">
                    <div class="iv-label">SPD</div>
                    <div class="iv-value">${pokemon.ivs.speed}/15</div>
                </div>
                <div class="iv-item">
                    <div class="iv-label">SPC</div>
                    <div class="iv-value">${pokemon.ivs.special}/15</div>
                </div>
            </div>
        </div>
        ` : ''}
        
        <!-- Statistiques de base (Base Stats) -->
        ${pokemonData && pokemonData.stats ? `
        <div class="pokemon-details-section">
            <h4>📈 Statistiques de Base</h4>
            <div class="base-stats-container">
                ${Object.entries(pokemonData.stats).map(([statName, statValue]) => {
                    const statNames = {
                        'hp': 'PV',
                        'attack': 'Attaque',
                        'defense': 'Défense',
                        'special-attack': 'Att. Spé.',
                        'special-defense': 'Déf. Spé.',
                        'speed': 'Vitesse'
                    };
                    const displayName = statNames[statName] || statName;
                    const percentage = Math.min((statValue / 255) * 100, 100);
                    const statColor = statValue >= 100 ? '#2ea44f' : statValue >= 70 ? '#0969da' : statValue >= 50 ? '#fb8500' : '#cf222e';
                    
                    return `
                        <div class="base-stat-row">
                            <span class="base-stat-name">${displayName}</span>
                            <div class="base-stat-bar-container">
                                <div class="base-stat-bar" style="width: ${percentage}%; background: ${statColor};"></div>
                            </div>
                            <span class="base-stat-value">${statValue}</span>
                        </div>
                    `;
                }).join('')}
                <div class="base-stat-total">
                    <span class="base-stat-name"><strong>Total</strong></span>
                    <span class="base-stat-value"><strong>${Object.values(pokemonData.stats).reduce((a, b) => a + b, 0)}</strong></span>
                </div>
            </div>
        </div>
        ` : ''}
        
        <!-- Meta Info -->
        <div class="pokemon-details-section">
            <h4>📋 Informations</h4>
            <div class="pokemon-meta">
                ${pokemon.ball ? `<div class="meta-item"><span class="meta-label">Ball:</span><span class="meta-value">${pokemon.ball}</span></div>` : ''}
                ${pokemon.exp ? `<div class="meta-item"><span class="meta-label">EXP:</span><span class="meta-value">${pokemon.exp.toLocaleString()}</span></div>` : ''}
                ${pokemon.importDate ? `<div class="meta-item"><span class="meta-label">Importé le:</span><span class="meta-value">${new Date(pokemon.importDate).toLocaleDateString('fr-FR')}</span></div>` : ''}
            </div>
        </div>
    `;
    
    document.getElementById('pokemonDetailsContent').innerHTML = content;
    document.getElementById('pokemonDetailsModal').classList.add('active');
}

// Fermer le modal de détails
function closePokemonDetailsModal() {
    document.getElementById('pokemonDetailsModal').classList.remove('active');
}
