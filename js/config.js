/* ============================================
   CONFIGURATION - Données et constantes
   ============================================ */

// Liste des jeux disponibles avec leurs images et génération
const availableGames = [
    { name: 'Pokémon Jaune', image: 'image-jeu/pokemon_jaune.png', gen: 1, maxDex: 151, spriteFolder: 'Gen1/yellow' },
    { name: 'Pokémon Cristal', image: 'image-jeu/pokemon_cristal.png', gen: 2, maxDex: 251, spriteFolder: 'Gen2/crystal' },
    { name: 'Pokémon Rouge Feu', image: 'image-jeu/224.png', gen: 3, maxDex: 386, spriteFolder: 'Gen3/firered-leafgreen' },
    { name: 'Pokémon Émeraude', image: 'image-jeu/pokemon_emeraude.png', gen: 3, maxDex: 386, spriteFolder: 'Gen3/emerald' },
    { name: 'Pokémon Platine', image: 'image-jeu/pokemon_platine.jpg', gen: 4, maxDex: 493, spriteFolder: 'Gen4/diamond-pearl' },
    { name: 'Pokémon HeartGold', image: 'image-jeu/81ESDoG1PVL.webp', gen: 4, maxDex: 493, spriteFolder: 'Gen4/heartgold-soulsilver' },
    { name: 'Pokémon SoulSilver', image: '', gen: 4, maxDex: 493, spriteFolder: 'Gen4/heartgold-soulsilver' },
    { name: 'Pokémon Noir', image: 'image-jeu/pokemon_version_noire.jpg', gen: 5, maxDex: 649, spriteFolder: 'Gen5' },
    { name: 'Pokémon Blanc', image: '', gen: 5, maxDex: 649, spriteFolder: 'Gen5' },
    { name: 'Pokémon Noir 2', image: 'image-jeu/pokemon_version_noire_2.jpg', gen: 5, maxDex: 649, spriteFolder: 'Gen5' },
    { name: 'Pokémon Blanc 2', image: '', gen: 5, maxDex: 649, spriteFolder: 'Gen5' },
    { name: 'Pokémon X', image: 'image-jeu/pokemon_x.png', gen: 6, maxDex: 721, spriteFolder: 'Gen6/x-y' },
    { name: 'Pokémon Y', image: '', gen: 6, maxDex: 721, spriteFolder: 'Gen6/x-y' },
    { name: 'Pokémon Soleil', image: '', gen: 7, maxDex: 807, spriteFolder: 'Gen7/sun-moon' },
    { name: 'Pokémon Lune', image: 'image-jeu/pokemon_lune.jpg', gen: 7, maxDex: 807, spriteFolder: 'Gen7/sun-moon' },
];
