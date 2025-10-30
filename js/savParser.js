// Parser de fichiers .sav pour Pokémon - Wrapper autour de PKHeX Backend
// Maintient la compatibilité avec l'ancien code tout en utilisant le nouveau backend

// IMPORTANT: Ce fichier utilise maintenant PKHeXBackend (pkhex-backend.js)
// pour supporter toutes les générations de Pokémon

// Offsets pour Gen 1 (Yellow) - Conservés pour compatibilité
const GEN1_OFFSETS = {
    PARTY_COUNT: 0x2F2C,
    PARTY_DATA: 0x2F2C,
    PARTY_POKEMON: 0x2F2D,
    PARTY_OT_NAMES: 0x2F8D,
    PARTY_NICKNAMES: 0x3021
};

// Table de correspondance des IDs Pokémon Gen 1 (Index interne → Numéro Pokédex)
const GEN1_POKEMON_IDS = {
    0x01: 112, 0x02: 115, 0x03: 32, 0x04: 35, 0x05: 21, 0x06: 100, 0x07: 34, 0x08: 80,
    0x09: 2, 0x0A: 103, 0x0B: 108, 0x0C: 102, 0x0D: 88, 0x0E: 94, 0x0F: 29,
    0x10: 31, 0x11: 104, 0x12: 111, 0x13: 131, 0x14: 59, 0x15: 151, 0x16: 130, 0x17: 90,
    0x18: 72, 0x19: 92, 0x1A: 123, 0x1B: 120, 0x1C: 9, 0x1D: 127, 0x1E: 114,
    0x21: 58, 0x22: 95, 0x23: 22, 0x24: 16, 0x25: 52, 0x26: 48, 0x27: 84,
    0x28: 86, 0x29: 144, 0x2A: 145, 0x2B: 132, 0x2C: 146, 0x2D: 55, 0x2E: 97,
    0x2F: 85, 0x30: 142, 0x31: 87, 0x32: 140, 0x33: 1, 0x34: 54, 0x35: 47,
    0x36: 84, 0x37: 96, 0x38: 50, 0x39: 75, 0x3A: 105, 0x3B: 64, 0x3C: 149,
    0x3D: 56, 0x3E: 90, 0x3F: 91, 0x40: 79, 0x41: 59, 0x42: 49, 0x43: 83,
    0x44: 81, 0x45: 82, 0x46: 60, 0x47: 62, 0x48: 63, 0x49: 118, 0x4A: 119,
    0x4B: 77, 0x4C: 78, 0x4D: 19, 0x4E: 20, 0x4F: 33, 0x50: 30, 0x51: 74,
    0x52: 137, 0x53: 106, 0x54: 25, 0x55: 26, 0x56: 134, 0x57: 135, 0x58: 136,
    0x59: 37, 0x5A: 38, 0x5B: 39, 0x5C: 40, 0x5D: 109, 0x5E: 110, 0x5F: 113,
    0x60: 66, 0x61: 41, 0x62: 23, 0x63: 46, 0x64: 61, 0x65: 62, 0x66: 13,
    0x67: 14, 0x68: 15, 0x69: 85, 0x6A: 57, 0x6B: 51, 0x6C: 49, 0x6D: 87,
    0x6E: 10, 0x6F: 11, 0x70: 12, 0x71: 68, 0x72: 67, 0x73: 55, 0x74: 97,
    0x75: 42, 0x76: 150, 0x77: 143, 0x78: 129, 0x79: 89, 0x7A: 99, 0x7B: 91,
    0x7C: 101, 0x7D: 36, 0x7E: 110, 0x7F: 53, 0x80: 105, 0x81: 126, 0x82: 82,
    0x83: 76, 0x84: 144, 0x85: 145, 0x86: 24, 0x87: 88, 0x88: 104, 0x89: 153,
    0x8A: 154, 0x8B: 155, 0x8C: 156, 0x8D: 157, 0x8E: 158, 0x8F: 68, 0x90: 69,
    0x91: 70, 0x92: 71, 0x93: 72, 0x94: 73, 0x95: 74, 0x96: 27, 0x97: 28,
    0x98: 138, 0x99: 139, 0x9A: 140, 0x9B: 141, 0x9C: 116, 0x9D: 117, 0x9E: 27,
    0x9F: 28, 0xA0: 138, 0xA1: 139, 0xA2: 140, 0xA3: 141, 0xA4: 116, 0xA5: 117,
    0xA6: 27, 0xA7: 28, 0xA8: 138, 0xA9: 139, 0xAA: 140, 0xAB: 141, 0xAC: 116,
    0xAD: 117, 0xAE: 27, 0xAF: 28, 0xB0: 138, 0xB1: 139, 0xB2: 140, 0xB3: 141,
    0xB4: 3, 0xB5: 6, 0xB6: 4, 0xB7: 5, 0xB8: 7, 0xB9: 8, 0xBA: 43,
    0xBB: 44, 0xBC: 45, 0xBD: 69, 0xBE: 70, 0xBF: 71
};

// ✅ Utilise PokemonData au lieu de redéclarer pokemonNames
// const pokemonNames est maintenant défini dans pokemon-data.js
// Pas besoin de le redéclarer ici

// ANCIEN CODE (commenté pour éviter la duplication)
/*
const pokemonNames = {
    1: 'Bulbizarre', 2: 'Herbizarre', 3: 'Florizarre', 4: 'Salamèche', 5: 'Reptincel',
    6: 'Dracaufeu', 7: 'Carapuce', 8: 'Carabaffe', 9: 'Tortank', 10: 'Chenipan',
    11: 'Chrysacier', 12: 'Papilusion', 13: 'Aspicot', 14: 'Coconfort', 15: 'Dardargnan',
    16: 'Roucool', 17: 'Roucoups', 18: 'Roucarnage', 19: 'Rattata', 20: 'Rattatac',
    21: 'Piafabec', 22: 'Rapasdepic', 23: 'Abo', 24: 'Arbok', 25: 'Pikachu',
    26: 'Raichu', 27: 'Sabelette', 28: 'Sablaireau', 29: 'Nidoran♀', 30: 'Nidorina',
    31: 'Nidoqueen', 32: 'Nidoran♂', 33: 'Nidorino', 34: 'Nidoking', 35: 'Mélofée',
    36: 'Mélodelfe', 37: 'Goupix', 38: 'Feunard', 39: 'Rondoudou', 40: 'Grodoudou',
    41: 'Nosferapti', 42: 'Nosferalto', 43: 'Mystherbe', 44: 'Ortide', 45: 'Rafflesia',
    46: 'Paras', 47: 'Parasect', 48: 'Mimitoss', 49: 'Aéromite', 50: 'Taupiqueur',
    51: 'Triopikeur', 52: 'Miaouss', 53: 'Persian', 54: 'Psykokwak', 55: 'Akwakwak',
    56: 'Férosinge', 57: 'Colossinge', 58: 'Caninos', 59: 'Arcanin', 60: 'Ptitard',
    61: 'Têtarte', 62: 'Tartard', 63: 'Abra', 64: 'Kadabra', 65: 'Alakazam',
    66: 'Machoc', 67: 'Machopeur', 68: 'Mackogneur', 69: 'Chétiflor', 70: 'Boustiflor',
    71: 'Empiflor', 72: 'Tentacool', 73: 'Tentacruel', 74: 'Racaillou', 75: 'Gravalanch',
    76: 'Grolem', 77: 'Ponyta', 78: 'Galopa', 79: 'Ramoloss', 80: 'Flagadoss',
    81: 'Magnéti', 82: 'Magnéton', 83: 'Canarticho', 84: 'Doduo', 85: 'Dodrio',
    86: 'Otaria', 87: 'Lamantine', 88: 'Tadmorv', 89: 'Grotadmorv', 90: 'Kokiyas',
    91: 'Crustabri', 92: 'Fantominus', 93: 'Spectrum', 94: 'Ectoplasma', 95: 'Onix',
    96: 'Soporifik', 97: 'Hypnomade', 98: 'Krabby', 99: 'Krabboss', 100: 'Voltorbe',
    101: 'Électrode', 102: 'Noeunoeuf', 103: 'Noadkoko', 104: 'Osselait', 105: 'Ossatueur',
    106: 'Kicklee', 107: 'Tygnon', 108: 'Excelangue', 109: 'Smogo', 110: 'Smogogo',
    111: 'Rhinocorne', 112: 'Rhinoféros', 113: 'Leveinard', 114: 'Saquedeneu', 115: 'Kangourex',
    116: 'Hypotrempe', 117: 'Hypocéan', 118: 'Poissirène', 119: 'Poissoroy', 120: 'Stari',
    121: 'Staross', 122: 'M.Mime', 123: 'Insécateur', 124: 'Lippoutou', 125: 'Élektek',
    126: 'Magmar', 127: 'Scarabrute', 128: 'Tauros', 129: 'Magicarpe', 130: 'Léviator',
    131: 'Lokhlass', 132: 'Métamorph', 133: 'Évoli', 134: 'Aquali', 135: 'Voltali',
    136: 'Pyroli', 137: 'Porygon', 138: 'Amonita', 139: 'Amonistar', 140: 'Kabuto',
    141: 'Kabutops', 142: 'Ptéra', 143: 'Ronflex', 144: 'Artikodin', 145: 'Électhor',
    146: 'Sulfura', 147: 'Minidraco', 148: 'Draco', 149: 'Dracolosse', 150: 'Mewtwo',
    151: 'Mew'
};
*/

// Parser le fichier .sav - Essaie le backend API en premier
async function parseSaveFile(arrayBuffer, file = null) {
    try {
        // 1. Essayer le backend API (Node.js + PKHeX.Core) en premier
        if (typeof BackendAPI !== 'undefined' && file) {
            try {
                const isBackendAvailable = await BackendAPI.checkHealth();
                if (isBackendAvailable) {
                    console.log('🚀 Utilisation du Backend API (PKHeX.Core)...');
                    const result = await BackendAPI.parseSave(file);
                    console.log('✅ Save parsée par le backend:', result);
                    return result;
                }
            } catch (backendError) {
                console.warn('⚠️ Backend API non disponible, fallback sur JS parser:', backendError.message);
            }
        }
        
        // 2. Fallback sur PKHeXBackend JS (Gen 1-2 fonctionnent, Gen 3+ limités)
        if (typeof PKHeXBackend !== 'undefined') {
            console.log('🎮 Utilisation de PKHeX Backend JS pour parser la save...');
            
            // Détecter le type de save
            const saveInfo = PKHeXBackend.detectSaveType(arrayBuffer);
            console.log('📊 Save détectée:', saveInfo);
            
            // Parser avec le backend
            const result = PKHeXBackend.parseSaveFile(arrayBuffer);
            
            // Enrichir les données avec les noms de Pokémon
            if (result.team && result.team.length > 0) {
                result.team = result.team.map(pokemon => {
                    // Utiliser PokemonData si disponible, sinon pokemonNames global
                    const pokemonName = (typeof PokemonData !== 'undefined' 
                        ? PokemonData.getName(pokemon.number) 
                        : (typeof pokemonNames !== 'undefined' ? pokemonNames[pokemon.number] : null))
                        || pokemon.name;
                    return {
                        ...pokemon,
                        name: pokemon.nickname || pokemonName,
                        species: pokemonName
                    };
                });
            }
            
            console.log('✅ Save parsée avec succès:', result);
            return result;
        }
        
        // 3. Dernier fallback : ancien parser Gen 1
        console.warn('⚠️ PKHeX Backend non disponible, utilisation du parser Gen 1 legacy');
        return parseSaveFileLegacy(arrayBuffer);
        
    } catch (error) {
        console.error('❌ Erreur lors du parsing de la save:', error);
        throw error;
    }
}

// Ancien parser Gen 1 (conservé comme fallback)
function parseSaveFileLegacy(arrayBuffer) {
    const data = new Uint8Array(arrayBuffer);
    
    // Vérifier la taille du fichier (32KB pour Gen 1)
    if (data.length !== 32768) {
        throw new Error('Fichier .sav invalide. Taille attendue : 32KB');
    }
    
    // Lire le nombre de Pokémon dans l'équipe
    const partyCount = data[GEN1_OFFSETS.PARTY_COUNT];
    
    if (partyCount === 0 || partyCount > 6) {
        throw new Error('Aucune équipe détectée dans la save');
    }
    
    const team = [];
    
    // Lire chaque Pokémon de l'équipe
    for (let i = 0; i < partyCount; i++) {
        const speciesIndex = data[GEN1_OFFSETS.PARTY_POKEMON + i];
        
        // Convertir l'index Gen 1 en numéro de Pokédex
        const dexNumber = GEN1_POKEMON_IDS[speciesIndex] || speciesIndex;
        
        // Lire le surnom (11 caractères max)
        let nickname = '';
        const nicknameOffset = GEN1_OFFSETS.PARTY_NICKNAMES + (i * 11);
        for (let j = 0; j < 11; j++) {
            const char = data[nicknameOffset + j];
            if (char === 0x50 || char === 0x00) break; // Terminateur
            nickname += decodeGen1Char(char);
        }
        
        // Utiliser le nom par défaut si pas de surnom
        const pokemonName = nickname.trim() || 
            (typeof PokemonData !== 'undefined' ? PokemonData.getName(dexNumber) : null) ||
            (typeof window.pokemonNames !== 'undefined' ? window.pokemonNames[dexNumber] : null) ||
            `Pokémon #${dexNumber}`;
        
        // Lire les données du Pokémon (44 bytes par Pokémon)
        const pokemonDataOffset = GEN1_OFFSETS.PARTY_DATA + 8 + (i * 44);
        
        // Données de base
        const level = data[pokemonDataOffset + 33];
        const hp = (data[pokemonDataOffset + 1] << 8) | data[pokemonDataOffset + 2];
        const maxHp = (data[pokemonDataOffset + 34] << 8) | data[pokemonDataOffset + 35];
        const status = data[pokemonDataOffset + 4]; // 0 = OK, autres = statut
        
        // Stats
        const attack = (data[pokemonDataOffset + 36] << 8) | data[pokemonDataOffset + 37];
        const defense = (data[pokemonDataOffset + 38] << 8) | data[pokemonDataOffset + 39];
        const speed = (data[pokemonDataOffset + 40] << 8) | data[pokemonDataOffset + 41];
        const special = (data[pokemonDataOffset + 42] << 8) | data[pokemonDataOffset + 43];
        
        // Attaques (4 attaques max)
        const moves = [];
        for (let m = 0; m < 4; m++) {
            const moveId = data[pokemonDataOffset + 8 + m];
            const movePP = data[pokemonDataOffset + 29 + m];
            if (moveId > 0) {
                moves.push({
                    id: moveId,
                    name: getMoveNameGen1(moveId),
                    pp: movePP
                });
            }
        }
        
        // Expérience
        const exp = (data[pokemonDataOffset + 14] << 16) | 
                    (data[pokemonDataOffset + 15] << 8) | 
                    data[pokemonDataOffset + 16];
        
        // IVs (Individual Values) - stats cachées
        const ivData = (data[pokemonDataOffset + 17] << 8) | data[pokemonDataOffset + 18];
        const ivs = {
            attack: (ivData >> 12) & 0xF,
            defense: (ivData >> 8) & 0xF,
            speed: (ivData >> 4) & 0xF,
            special: ivData & 0xF
        };
        
        // Type de Poké Ball (offset dans les données OT)
        const otDataOffset = GEN1_OFFSETS.PARTY_DATA + 8 + 44 * 6 + (i * 11);
        const caughtData = data[otDataOffset + 7];
        const ballType = getBallType(caughtData);
        
        team.push({
            number: dexNumber,
            name: pokemonName,
            level: level,
            hp: hp,
            maxHp: maxHp,
            isAlive: hp > 0,
            status: getStatusName(status),
            stats: {
                attack: attack,
                defense: defense,
                speed: speed,
                special: special
            },
            moves: moves,
            exp: exp,
            ivs: ivs,
            ball: ballType,
            sprite: `Gen1/yellow/${String(dexNumber).padStart(4, '0')}.png`,
            importDate: new Date().toISOString()
        });
    }
    
    return {
        partyCount: partyCount,
        team: team
    };
}

// Décoder un caractère Gen 1
function decodeGen1Char(byte) {
    // Table de caractères Gen 1 simplifiée
    const charMap = {
        0x80: 'A', 0x81: 'B', 0x82: 'C', 0x83: 'D', 0x84: 'E', 0x85: 'F', 0x86: 'G',
        0x87: 'H', 0x88: 'I', 0x89: 'J', 0x8A: 'K', 0x8B: 'L', 0x8C: 'M', 0x8D: 'N',
        0x8E: 'O', 0x8F: 'P', 0x90: 'Q', 0x91: 'R', 0x92: 'S', 0x93: 'T', 0x94: 'U',
        0x95: 'V', 0x96: 'W', 0x97: 'X', 0x98: 'Y', 0x99: 'Z',
        0xA0: 'a', 0xA1: 'b', 0xA2: 'c', 0xA3: 'd', 0xA4: 'e', 0xA5: 'f', 0xA6: 'g',
        0xA7: 'h', 0xA8: 'i', 0xA9: 'j', 0xAA: 'k', 0xAB: 'l', 0xAC: 'm', 0xAD: 'n',
        0xAE: 'o', 0xAF: 'p', 0xB0: 'q', 0xB1: 'r', 0xB2: 's', 0xB3: 't', 0xB4: 'u',
        0xB5: 'v', 0xB6: 'w', 0xB7: 'x', 0xB8: 'y', 0xB9: 'z',
        0xF6: '0', 0xF7: '1', 0xF8: '2', 0xF9: '3', 0xFA: '4',
        0xFB: '5', 0xFC: '6', 0xFD: '7', 0xFE: '8', 0xFF: '9',
        0x7F: ' ', 0xE0: '\'', 0xE3: '-'
    };
    
    return charMap[byte] || '';
}

// Détecter le type de save - Utilise PKHeXBackend si disponible
function detectSaveType(arrayBuffer) {
    // Utiliser PKHeXBackend si disponible
    if (typeof PKHeXBackend !== 'undefined') {
        return PKHeXBackend.detectSaveType(arrayBuffer);
    }
    
    // Fallback legacy
    const data = new Uint8Array(arrayBuffer);
    
    // Vérifications basiques
    if (data.length === 32768) {
        return 'Gen1'; // Rouge/Bleu/Jaune
    } else if (data.length === 65536) {
        return 'Gen2'; // Or/Argent/Cristal
    }
    
    return 'Unknown';
}

// Obtenir le nom d'une attaque Gen 1 (liste simplifiée des attaques principales)
function getMoveNameGen1(moveId) {
    const moves = {
        1: 'Écras\'Face', 2: 'Poing Karaté', 3: 'Torgnoles', 4: 'Poing Comète',
        5: 'Ultimapoing', 6: 'Jackpot', 7: 'Poing de Feu', 8: 'Poing-Glace',
        9: 'Poing-Éclair', 10: 'Griffe', 13: 'Coupe-Vent', 14: 'Danse-Lames',
        15: 'Coupe', 16: 'Tornade', 17: 'Cru-Aile', 20: 'Étreinte', 21: 'Souplesse',
        22: 'Poing-Karaté', 23: 'Furie', 24: 'Guillotine', 25: 'Tranche',
        26: 'Soin', 27: 'Vague Psy', 28: 'Hâte', 29: 'Vive-Attaque',
        30: 'Frénésie', 31: 'Téléport', 32: 'Ténèbres', 33: 'Mimique',
        34: 'Cri', 35: 'Rugissement', 36: 'Berceuse', 37: 'Ultrason',
        38: 'Bélier', 39: 'Charge', 40: 'Ligotage', 44: 'Morsure',
        45: 'Rugissement', 50: 'Flammèche', 51: 'Lance-Flamme', 52: 'Brume',
        53: 'Pistolet à O', 54: 'Hydrocanon', 55: 'Surf', 56: 'Laser Glace',
        57: 'Blizzard', 58: 'Rafale Psy', 59: 'Bulles d\'O', 60: 'Onde Folie',
        61: 'Onde Boréale', 62: 'Ultralaser', 63: 'Picpic', 64: 'Bec Vrille',
        65: 'Sacrifice', 66: 'Charge', 67: 'Plaquage', 68: 'Écrasement',
        69: 'Double Pied', 70: 'Ultimawashi', 71: 'Balayage', 72: 'Double Dard',
        73: 'Dard-Venin', 74: 'Vampirisme', 75: 'Puissance', 76: 'Méga-Sangsue',
        77: 'Vampigraine', 78: 'Croissance', 79: 'Tranch\'Herbe', 80: 'Danse-Fleur',
        81: 'Poudre Toxik', 82: 'Para-Spore', 83: 'Poudre Dodo', 84: 'Danse-Pétale',
        85: 'Sécrétion', 86: 'Piqûre', 87: 'Toxik', 88: 'Choc Mental',
        89: 'Psyko', 90: 'Hypnose', 91: 'Yoga', 92: 'Hâte',
        93: 'Poing-Karaté', 94: 'Téléport', 95: 'Ténèbres', 96: 'Mimique',
        98: 'Vive-Attaque', 99: 'Frénésie', 100: 'Téléport', 101: 'Ténèbres',
        102: 'Mimique', 103: 'Cri', 104: 'Rugissement', 105: 'Berceuse',
        106: 'Ultrason', 107: 'Bélier', 108: 'Charge', 109: 'Ligotage',
        110: 'Morsure', 120: 'Destruction', 121: 'Cascade', 122: 'Coud\'Krane',
        123: 'Amnésie', 124: 'Rafale Psy', 125: 'Télékinésie', 126: 'Bomb\'Œuf',
        127: 'Pilonnage', 128: 'Poing de Feu', 129: 'Poing-Éclair', 130: 'Poing-Glace',
        131: 'Griffe', 132: 'Coupe-Vent', 133: 'Danse-Lames', 134: 'Coupe',
        135: 'Tornade', 136: 'Cru-Aile', 137: 'Étreinte', 138: 'Souplesse',
        139: 'Poing-Karaté', 140: 'Furie', 141: 'Guillotine', 142: 'Tranche',
        143: 'Soin', 144: 'Vague Psy', 145: 'Hâte', 146: 'Vive-Attaque',
        147: 'Frénésie', 148: 'Téléport', 149: 'Ténèbres', 150: 'Mimique',
        151: 'Cri', 152: 'Rugissement', 153: 'Berceuse', 154: 'Ultrason',
        155: 'Bélier', 156: 'Charge', 157: 'Ligotage', 158: 'Morsure',
        159: 'Rugissement', 160: 'Flammèche', 161: 'Lance-Flamme', 162: 'Brume',
        163: 'Éclair', 164: 'Tonnerre', 165: 'Fatal-Foudre'
    };
    return moves[moveId] || `Attaque #${moveId}`;
}

// Obtenir le nom du statut
function getStatusName(status) {
    if (status === 0) return 'OK';
    if (status & 0x04) return 'Empoisonné';
    if (status & 0x08) return 'Brûlé';
    if (status & 0x10) return 'Gelé';
    if (status & 0x20) return 'Paralysé';
    if (status & 0x40) return 'Endormi';
    return 'OK';
}

// Obtenir le type de Poké Ball
function getBallType(caughtData) {
    // En Gen 1, la ball est encodée dans les bits du byte
    const ballId = (caughtData >> 4) & 0xF;
    const balls = {
        0: 'Poké Ball',
        1: 'Super Ball',
        2: 'Hyper Ball',
        3: 'Master Ball',
        4: 'Safari Ball'
    };
    return balls[ballId] || 'Poké Ball';
}
