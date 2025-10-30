/* ============================================
   POKEAPI - Intégration de la PokeAPI
   ============================================ */

// Cache pour éviter de refaire les mêmes requêtes
const pokeApiCache = new Map();

/**
 * Récupère les données d'un Pokémon depuis la PokeAPI
 * @param {number} pokemonId - L'ID du Pokémon (1-898)
 * @returns {Promise<Object>} Les données du Pokémon
 */
async function fetchPokemonData(pokemonId) {
    // Vérifier le cache
    if (pokeApiCache.has(pokemonId)) {
        return pokeApiCache.get(pokemonId);
    }
    
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Extraire les sprites
        const sprites = {
            front_default: data.sprites.front_default,
            front_shiny: data.sprites.front_shiny,
            back_default: data.sprites.back_default,
            back_shiny: data.sprites.back_shiny,
            // Sprites officiels de haute qualité
            official: data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default,
            // Sprites animés (si disponibles)
            animated: data.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default || null
        };
        
        // Créer un objet simplifié avec les infos importantes
        const pokemonData = {
            id: data.id,
            name: data.name,
            sprites: sprites,
            types: data.types.map(t => t.type.name),
            height: data.height,
            weight: data.weight,
            stats: data.stats.reduce((acc, stat) => {
                acc[stat.stat.name] = stat.base_stat;
                return acc;
            }, {})
        };
        
        // Mettre en cache
        pokeApiCache.set(pokemonId, pokemonData);
        
        return pokemonData;
    } catch (error) {
        console.error(`Erreur lors de la récupération du Pokémon #${pokemonId}:`, error);
        return null;
    }
}

/**
 * Récupère uniquement les sprites d'un Pokémon
 * @param {number} pokemonId - L'ID du Pokémon
 * @returns {Promise<Object>} Les sprites du Pokémon
 */
async function fetchPokemonSprites(pokemonId) {
    const data = await fetchPokemonData(pokemonId);
    return data ? data.sprites : null;
}

/**
 * Obtient l'URL du sprite par défaut d'un Pokémon
 * @param {number} pokemonId - L'ID du Pokémon
 * @returns {string} L'URL du sprite
 */
function getPokemonSpriteUrl(pokemonId) {
    // Utiliser les sprites "home" qui sont mieux cadrés (256x256px, moins d'espace vide)
    // Fallback sur les sprites normaux si home n'existe pas (Gen 8+)
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemonId}.png`;
}

/**
 * Obtient l'URL du sprite officiel de haute qualité
 * @param {number} pokemonId - L'ID du Pokémon
 * @returns {string} L'URL du sprite officiel
 */
function getPokemonOfficialArtwork(pokemonId) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
}

/**
 * Obtient l'URL du sprite shiny
 * @param {number} pokemonId - L'ID du Pokémon
 * @returns {string} L'URL du sprite shiny
 */
function getPokemonShinySprite(pokemonId) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemonId}.png`;
}

/**
 * Obtient l'URL du sprite de dos
 * @param {number} pokemonId - L'ID du Pokémon
 * @returns {string} L'URL du sprite de dos
 */
function getPokemonBackSprite(pokemonId) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokemonId}.png`;
}

/**
 * Obtient l'URL du sprite de dos shiny
 * @param {number} pokemonId - L'ID du Pokémon
 * @returns {string} L'URL du sprite de dos shiny
 */
function getPokemonBackShinySprite(pokemonId) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/${pokemonId}.png`;
}

/**
 * Obtient toutes les URLs de sprites pour un Pokémon
 * @param {number} pokemonId - L'ID du Pokémon
 * @returns {Object} Objet contenant toutes les URLs de sprites
 */
function getAllPokemonSprites(pokemonId) {
    return {
        front_default: getPokemonSpriteUrl(pokemonId),
        front_shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${pokemonId}.png`,
        back_default: getPokemonBackSprite(pokemonId),
        back_shiny: getPokemonBackShinySprite(pokemonId),
        official: getPokemonOfficialArtwork(pokemonId)
    };
}

/**
 * Précharge les sprites d'une liste de Pokémon
 * @param {Array<number>} pokemonIds - Liste des IDs de Pokémon
 */
function preloadPokemonSprites(pokemonIds) {
    pokemonIds.forEach(id => {
        const img = new Image();
        img.src = getPokemonSpriteUrl(id);
    });
}

/**
 * Obtient le sprite selon la génération (pour compatibilité avec l'ancien système)
 * @param {number} pokemonId - L'ID du Pokémon
 * @param {number} generation - La génération du jeu (1-8)
 * @returns {string} L'URL du sprite approprié
 */
function getPokemonSpriteByGeneration(pokemonId, generation) {
    // Pour les générations 1-5, utiliser les sprites pixelisés
    if (generation <= 5) {
        const genFolder = {
            1: 'red-blue',
            2: 'crystal',
            3: 'emerald',
            4: 'platinum',
            5: 'black-white'
        }[generation] || 'red-blue';
        
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-${generation}/${genFolder}/${pokemonId}.png`;
    }
    
    // Pour les générations récentes, utiliser le sprite par défaut
    return getPokemonSpriteUrl(pokemonId);
}

// Export des fonctions pour utilisation globale
window.PokeAPI = {
    fetchPokemonData,
    fetchPokemonSprites,
    getPokemonSpriteUrl,
    getPokemonOfficialArtwork,
    getPokemonShinySprite,
    getPokemonBackSprite,
    getPokemonBackShinySprite,
    getAllPokemonSprites,
    preloadPokemonSprites,
    getPokemonSpriteByGeneration
};

console.log('✅ PokeAPI module chargé');
