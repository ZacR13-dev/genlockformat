/* ============================================
   POKEMON DATABASE - Base de données complète
   Toutes les générations (1-9)
   ============================================ */

const PokemonDatabase = {
    // Noms des Pokémon (multilingue)
    pokemon: {
        1: { fr: 'Bulbizarre', en: 'Bulbasaur', jp: 'フシギダネ', type: ['Plante', 'Poison'], gen: 1 },
        2: { fr: 'Herbizarre', en: 'Ivysaur', jp: 'フシギソウ', type: ['Plante', 'Poison'], gen: 1 },
        3: { fr: 'Florizarre', en: 'Venusaur', jp: 'フシギバナ', type: ['Plante', 'Poison'], gen: 1 },
        4: { fr: 'Salamèche', en: 'Charmander', jp: 'ヒトカゲ', type: ['Feu'], gen: 1 },
        5: { fr: 'Reptincel', en: 'Charmeleon', jp: 'リザード', type: ['Feu'], gen: 1 },
        6: { fr: 'Dracaufeu', en: 'Charizard', jp: 'リザードン', type: ['Feu', 'Vol'], gen: 1 },
        7: { fr: 'Carapuce', en: 'Squirtle', jp: 'ゼニガメ', type: ['Eau'], gen: 1 },
        8: { fr: 'Carabaffe', en: 'Wartortle', jp: 'カメール', type: ['Eau'], gen: 1 },
        9: { fr: 'Tortank', en: 'Blastoise', jp: 'カメックス', type: ['Eau'], gen: 1 },
        10: { fr: 'Chenipan', en: 'Caterpie', jp: 'キャタピー', type: ['Insecte'], gen: 1 },
        25: { fr: 'Pikachu', en: 'Pikachu', jp: 'ピカチュウ', type: ['Électrik'], gen: 1 },
        // ... (Ajouter tous les Pokémon jusqu'à Gen 9)
        // Pour l'instant, on garde une structure compacte
    },

    // Attaques par génération
    moves: {
        1: { fr: 'Écras\'Face', en: 'Pound', type: 'Normal', power: 40, accuracy: 100 },
        2: { fr: 'Poing Karaté', en: 'Karate Chop', type: 'Combat', power: 50, accuracy: 100 },
        33: { fr: 'Charge', en: 'Tackle', type: 'Normal', power: 40, accuracy: 100 },
        45: { fr: 'Rugissement', en: 'Growl', type: 'Normal', power: 0, accuracy: 100 },
        84: { fr: 'Danse-Pétale', en: 'Petal Dance', type: 'Plante', power: 120, accuracy: 100 },
        // ... (Ajouter toutes les attaques)
    },

    // Objets par génération
    items: {
        1: { fr: 'Master Ball', en: 'Master Ball', gen: 1, type: 'ball' },
        2: { fr: 'Ultra Ball', en: 'Ultra Ball', gen: 1, type: 'ball' },
        3: { fr: 'Super Ball', en: 'Great Ball', gen: 1, type: 'ball' },
        4: { fr: 'Poké Ball', en: 'Poké Ball', gen: 1, type: 'ball' },
        17: { fr: 'Potion', en: 'Potion', gen: 1, type: 'medicine' },
        29: { fr: 'Bonbon Rare', en: 'Rare Candy', gen: 1, type: 'vitamin' },
        // ... (Ajouter tous les objets)
    },

    // Badges par région
    badges: {
        kanto: [
            { id: 0, fr: 'Badge Roche', en: 'Boulder Badge', leader: 'Pierre' },
            { id: 1, fr: 'Badge Cascade', en: 'Cascade Badge', leader: 'Ondine' },
            { id: 2, fr: 'Badge Foudre', en: 'Thunder Badge', leader: 'Major Bob' },
            { id: 3, fr: 'Badge Arc-en-Ciel', en: 'Rainbow Badge', leader: 'Erika' },
            { id: 4, fr: 'Badge Âme', en: 'Soul Badge', leader: 'Koga' },
            { id: 5, fr: 'Badge Marais', en: 'Marsh Badge', leader: 'Morgane' },
            { id: 6, fr: 'Badge Volcan', en: 'Volcano Badge', leader: 'Auguste' },
            { id: 7, fr: 'Badge Terre', en: 'Earth Badge', leader: 'Giovanni' }
        ],
        johto: [
            { id: 0, fr: 'Badge Zéphyr', en: 'Zephyr Badge', leader: 'Albert' },
            { id: 1, fr: 'Badge Choc', en: 'Hive Badge', leader: 'Hector' },
            { id: 2, fr: 'Badge Plaine', en: 'Plain Badge', leader: 'Blanche' },
            { id: 3, fr: 'Badge Brume', en: 'Fog Badge', leader: 'Mortimer' },
            { id: 4, fr: 'Badge Tempête', en: 'Storm Badge', leader: 'Chuck' },
            { id: 5, fr: 'Badge Minéral', en: 'Mineral Badge', leader: 'Jasmine' },
            { id: 6, fr: 'Badge Glacier', en: 'Glacier Badge', leader: 'Sandra' },
            { id: 7, fr: 'Badge Levant', en: 'Rising Badge', leader: 'Peter' }
        ]
        // ... (Ajouter toutes les régions)
    },

    // Capacités spéciales (Abilities) Gen 3+
    abilities: {
        1: { fr: 'Engrais', en: 'Overgrow', description: 'Booste les attaques Plante à 1/3 des PV' },
        2: { fr: 'Chlorophylle', en: 'Chlorophyll', description: 'Double la Vitesse au soleil' },
        // ... (Ajouter toutes les capacités)
    },

    // Natures (Gen 3+)
    natures: {
        hardy: { fr: 'Hardi', en: 'Hardy', plus: null, minus: null },
        lonely: { fr: 'Solo', en: 'Lonely', plus: 'attack', minus: 'defense' },
        brave: { fr: 'Brave', en: 'Brave', plus: 'attack', minus: 'speed' },
        adamant: { fr: 'Rigide', en: 'Adamant', plus: 'attack', minus: 'spAttack' },
        // ... (Ajouter toutes les natures)
    },

    // Méthodes utilitaires
    getPokemonName(id, lang = 'fr') {
        return this.pokemon[id]?.[lang] || `Pokémon #${id}`;
    },

    getMoveName(id, lang = 'fr') {
        return this.moves[id]?.[lang] || `Attaque #${id}`;
    },

    getItemName(id, lang = 'fr') {
        return this.items[id]?.[lang] || `Objet #${id}`;
    },

    getBadgeName(region, badgeId, lang = 'fr') {
        return this.badges[region]?.[badgeId]?.[lang] || `Badge #${badgeId}`;
    },

    getAbilityName(id, lang = 'fr') {
        return this.abilities[id]?.[lang] || `Capacité #${id}`;
    },

    getNatureName(nature, lang = 'fr') {
        return this.natures[nature]?.[lang] || nature;
    },

    // Recherche
    searchPokemon(query, lang = 'fr') {
        query = query.toLowerCase();
        return Object.entries(this.pokemon)
            .filter(([id, data]) => data[lang].toLowerCase().includes(query))
            .map(([id, data]) => ({ id: parseInt(id), ...data }));
    },

    // Filtres
    getPokemonByGen(gen) {
        return Object.entries(this.pokemon)
            .filter(([id, data]) => data.gen === gen)
            .map(([id, data]) => ({ id: parseInt(id), ...data }));
    },

    getPokemonByType(type) {
        return Object.entries(this.pokemon)
            .filter(([id, data]) => data.type.includes(type))
            .map(([id, data]) => ({ id: parseInt(id), ...data }));
    }
};

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PokemonDatabase;
}
