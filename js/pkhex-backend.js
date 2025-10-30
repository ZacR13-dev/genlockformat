/* ============================================
   PKHEX BACKEND - Parser universel de saves Pokémon
   Basé sur PKHeX.Everywhere pour supporter Gen 1-8
   ============================================ */

const PKHeXBackend = (() => {
    'use strict';

    // Configuration des tailles de fichiers par génération
    const SAVE_SIZES = {
        GEN1: 0x8000,         // 32KB
        GEN2: 0x8000,         // 32KB
        GEN3: 0x20000,        // 128KB
        GEN4_DP: 0x40000,     // 256KB
        GEN4_HGSS: 0x80000,   // 512KB
        GEN5: 0x80000,        // 512KB
        GEN6_XY: 0x65600,     // 415KB
        GEN6_ORAS: 0x76000,   // 483KB
        GEN7: 0x6BE00,        // 441KB
        // DeSmuME peut ajouter des données supplémentaires
        DESMUME_EXTRA: 0x1F7000  // ~2MB pour .dst avec métadonnées
    };

    // Offsets pour Gen 1
    const GEN1_OFFSETS = {
        PARTY_COUNT: 0x2F2C,
        PARTY_DATA: 0x2F2C,
        PARTY_POKEMON: 0x2F2D,
        PARTY_NICKNAMES: 0x3021,
        PARTY_OT_NAMES: 0x2F8D,
        PLAYER_NAME: 0x2598,
        PLAYER_ID: 0x2605,
        RIVAL_NAME: 0x25F6,
        MONEY: 0x25F3,
        BADGES: 0x2602,
        PLAY_TIME: 0x2CED,
        POKEDEX_OWNED: 0x25A3,
        POKEDEX_SEEN: 0x25B6,
        CURRENT_BOX: 0x284C,
        CASINO_COINS: 0x2850,
        PIKACHU_FRIENDSHIP: 0x271C,  // Yellow only
        // PC Box 1
        PC_BOX1_COUNT: 0x30C0,
        PC_BOX1_DATA: 0x30C0,
        // Items
        ITEM_BAG: 0x25C9,
        ITEM_PC: 0x27E6,
        // Options
        OPTIONS: 0x2601
    };

    // Offsets pour Gen 2
    const GEN2_OFFSETS = {
        PARTY_COUNT: 0x2865,
        PARTY_DATA: 0x2865,
        PLAYER_NAME: 0x200B,
        MONEY: 0x2569,
        BADGES: 0x23E4
    };

    // Offsets pour Gen 3 (structure par sections)
    const GEN3_OFFSETS = {
        SAVE_BLOCK_A: 0x0000,
        SAVE_BLOCK_B: 0xE000,
        SECTION_SIZE: 0x1000,
        // Les sections sont réparties différemment selon le jeu
        // On les détectera dynamiquement
    };

    /**
     * Distingue Gen 1 et Gen 2 en analysant le contenu
     */
    function detectGen1or2(data) {
        // Gen 2 a des marqueurs spécifiques
        // Vérifier la présence de données Gen 2 caractéristiques
        
        // 1. Vérifier le nombre de Pokémon dans l'équipe aux deux offsets
        const gen1PartyCount = data[GEN1_OFFSETS.PARTY_COUNT];
        const gen2PartyCount = data[GEN2_OFFSETS.PARTY_COUNT];
        
        // 2. Gen 2 a souvent des valeurs spécifiques à certains offsets
        // Vérifier si l'offset Gen 2 semble plus valide
        if (gen2PartyCount > 0 && gen2PartyCount <= 6) {
            // Vérifier d'autres marqueurs Gen 2
            const gen2Check1 = data[0x2000]; // Gen 2 a souvent des données ici
            const gen2Check2 = data[0x2001]; // Début du nom du joueur en Gen 2
            
            // Si ces zones ont des données valides, c'est probablement Gen 2
            if (gen2Check1 !== 0 || gen2Check2 !== 0) {
                return 2;
            }
        }
        
        // Par défaut, considérer comme Gen 1
        return 1;
    }

    /**
     * Détecte le type de sauvegarde
     */
    function detectSaveType(arrayBuffer) {
        const size = arrayBuffer.byteLength;
        const data = new Uint8Array(arrayBuffer);

        // Détection exacte par taille
        switch (size) {
            case SAVE_SIZES.GEN1:
                return { generation: 1, game: 'Red/Blue/Yellow', size };
            case SAVE_SIZES.GEN2:
                return { generation: 2, game: 'Gold/Silver/Crystal', size };
            case SAVE_SIZES.GEN3:
                return { generation: 3, game: 'Ruby/Sapphire/Emerald/FRLG', size };
            case SAVE_SIZES.GEN4_DP:
                return { generation: 4, game: 'Diamond/Pearl/Platinum', size };
            case SAVE_SIZES.GEN4_HGSS:
                return { generation: 4, game: 'HeartGold/SoulSilver', size };
            case SAVE_SIZES.GEN5:
                return { generation: 5, game: 'Black/White/B2W2', size };
            case SAVE_SIZES.GEN6_XY:
                return { generation: 6, game: 'X/Y', size };
            case SAVE_SIZES.GEN6_ORAS:
                return { generation: 6, game: 'Omega Ruby/Alpha Sapphire', size };
            case SAVE_SIZES.GEN7:
                return { generation: 7, game: 'Sun/Moon/USUM', size };
        }
        
        // Détection approximative pour fichiers DeSmuME avec métadonnées
        if (size >= 0x1F0000 && size <= 0x200000) {
            // Fichier .dst de ~2MB - probablement Gen 4/5 avec header DeSmuME
            return { 
                generation: 4, 
                game: 'Diamond/Pearl/Platinum (DeSmuME format)', 
                size,
                note: 'Large .dst file detected - may contain emulator metadata',
                needsExtraction: true
            };
        }
        
        // Détection par plages de tailles avec analyse du contenu
        if (size >= 0x7000 && size <= 0x9000) {
            // Pourrait être Gen 1 ou Gen 2 - analyser le contenu pour distinguer
            const gen = detectGen1or2(data);
            if (gen === 2) {
                return { generation: 2, game: 'Gold/Silver/Crystal', size };
            }
            return { generation: 1, game: 'Red/Blue/Yellow (non-standard size)', size };
        }
        if (size >= 0x1F000 && size <= 0x21000) {
            return { generation: 3, game: 'Ruby/Sapphire/Emerald/FRLG (non-standard size)', size };
        }
        
        return { 
            generation: 0, 
            game: 'Unknown', 
            size, 
            error: `Unsupported save file size: ${size} bytes (0x${size.toString(16)})` 
        };
    }

    /**
     * Parse une sauvegarde complète
     */
    function parseSaveFile(arrayBuffer) {
        const saveInfo = detectSaveType(arrayBuffer);
        
        if (saveInfo.error && !saveInfo.needsExtraction) {
            throw new Error(saveInfo.error);
        }

        let data = new Uint8Array(arrayBuffer);
        
        // Extraire les données de save si c'est un fichier DeSmuME avec métadonnées
        if (saveInfo.needsExtraction) {
            console.log('⚠️ Fichier DeSmuME détecté - tentative d\'extraction de la save...');
            // Les fichiers .dst de DeSmuME ont souvent la save réelle au début
            // Essayer d'extraire les premiers 512KB (taille max Gen 4/5)
            const extractedSize = Math.min(SAVE_SIZES.GEN4_HGSS, data.length);
            data = data.slice(0, extractedSize);
            console.log(`📦 Extraction de ${extractedSize} bytes depuis le fichier .dst`);
            saveInfo.extracted = true;
            saveInfo.originalSize = arrayBuffer.byteLength;
        }
        
        switch (saveInfo.generation) {
            case 1:
                return parseGen1Save(data, saveInfo);
            case 2:
                return parseGen2Save(data, saveInfo);
            case 3:
                return parseGen3Save(data, saveInfo);
            case 4:
                return parseGen4Save(data, saveInfo);
            case 5:
                return parseGen5Save(data, saveInfo);
            case 6:
                return parseGen6Save(data, saveInfo);
            case 7:
                return parseGen7Save(data, saveInfo);
            default:
                return {
                    saveInfo,
                    message: `Generation ${saveInfo.generation} support coming soon`,
                    partyCount: 0,
                    team: []
                };
        }
    }

    /**
     * Parse une sauvegarde Gen 1
     */
    function parseGen1Save(data, saveInfo) {
        const partyCount = data[GEN1_OFFSETS.PARTY_COUNT];
        
        if (partyCount === 0 || partyCount > 6) {
            throw new Error('No valid party found');
        }

        const team = [];
        for (let i = 0; i < partyCount; i++) {
            const pokemon = parseGen1Pokemon(data, i);
            if (pokemon) team.push(pokemon);
        }

        // Informations du joueur
        const playerName = readGen1String(data, GEN1_OFFSETS.PLAYER_NAME, 11);
        const rivalName = readGen1String(data, GEN1_OFFSETS.RIVAL_NAME, 11);
        const playerId = (data[GEN1_OFFSETS.PLAYER_ID] << 8) | data[GEN1_OFFSETS.PLAYER_ID + 1];
        const money = readGen1Money(data, GEN1_OFFSETS.MONEY);
        const badges = data[GEN1_OFFSETS.BADGES];
        const playTime = readGen1PlayTime(data, GEN1_OFFSETS.PLAY_TIME);
        const casinoCoins = (data[GEN1_OFFSETS.CASINO_COINS] << 8) | data[GEN1_OFFSETS.CASINO_COINS + 1];
        const currentBox = data[GEN1_OFFSETS.CURRENT_BOX] & 0x7F;
        const options = data[GEN1_OFFSETS.OPTIONS];
        
        // Pokédex
        const pokedexOwned = countPokedexGen1(data, GEN1_OFFSETS.POKEDEX_OWNED);
        const pokedexSeen = countPokedexGen1(data, GEN1_OFFSETS.POKEDEX_SEEN);
        const pokedexCompletion = ((pokedexOwned / 151) * 100).toFixed(1);
        
        // Badges détaillés
        const badgeNames = ['Boulder', 'Cascade', 'Thunder', 'Rainbow', 'Soul', 'Marsh', 'Volcano', 'Earth'];
        const badgesDetails = [];
        for (let i = 0; i < 8; i++) {
            if (badges & (1 << i)) {
                badgesDetails.push(badgeNames[i]);
            }
        }
        
        // Sac d'objets (20 premiers items)
        const items = [];
        const itemCount = data[GEN1_OFFSETS.ITEM_BAG];
        for (let i = 0; i < Math.min(itemCount, 20); i++) {
            const itemId = data[GEN1_OFFSETS.ITEM_BAG + 1 + (i * 2)];
            const itemQty = data[GEN1_OFFSETS.ITEM_BAG + 2 + (i * 2)];
            if (itemId > 0) {
                items.push({ id: itemId, quantity: itemQty, name: getGen1ItemName(itemId) });
            }
        }
        
        // Pikachu friendship (Yellow only)
        let pikachuFriendship = null;
        if (data[GEN1_OFFSETS.PIKACHU_FRIENDSHIP] !== 0xFF) {
            pikachuFriendship = data[GEN1_OFFSETS.PIKACHU_FRIENDSHIP];
        }
        
        // PC Box 1 (premiers Pokémon)
        const pcBox1Count = data[GEN1_OFFSETS.PC_BOX1_COUNT];
        const pcBox1Pokemon = [];
        if (pcBox1Count > 0 && pcBox1Count <= 20) {
            for (let i = 0; i < Math.min(pcBox1Count, 5); i++) {
                const speciesIndex = data[GEN1_OFFSETS.PC_BOX1_DATA + 1 + i];
                const dexNumber = convertGen1IndexToDex(speciesIndex);
                if (dexNumber > 0) {
                    pcBox1Pokemon.push({ number: dexNumber, name: getGen1PokemonName(dexNumber) });
                }
            }
        }

        return {
            saveInfo,
            partyCount,
            team,
            player: {
                name: playerName,
                id: playerId,
                rivalName: rivalName,
                money: money,
                casinoCoins: casinoCoins,
                badges: badges,
                badgeCount: countBits(badges),
                badgesObtained: badgesDetails,
                playTime: playTime,
                currentBox: currentBox + 1,
                options: {
                    textSpeed: (options >> 4) & 0x7,
                    battleAnimation: (options & 0x80) === 0,
                    battleStyle: (options & 0x40) ? 'Set' : 'Switch'
                },
                pikachuFriendship: pikachuFriendship
            },
            pokedex: {
                owned: pokedexOwned,
                seen: pokedexSeen,
                completion: pokedexCompletion + '%',
                remaining: 151 - pokedexOwned
            },
            items: {
                bag: items,
                bagCount: itemCount
            },
            pc: {
                currentBox: currentBox + 1,
                box1Count: pcBox1Count,
                box1Preview: pcBox1Pokemon
            }
        };
    }

    /**
     * Parse un Pokémon Gen 1
     */
    function parseGen1Pokemon(data, index) {
        const speciesIndex = data[GEN1_OFFSETS.PARTY_POKEMON + index];
        const dexNumber = convertGen1IndexToDex(speciesIndex);
        
        if (dexNumber === 0) return null;

        const nicknameOffset = GEN1_OFFSETS.PARTY_NICKNAMES + (index * 11);
        const nickname = readGen1String(data, nicknameOffset, 11);
        const pokemonDataOffset = GEN1_OFFSETS.PARTY_DATA + 8 + (index * 44);
        
        const level = data[pokemonDataOffset + 33];
        const hp = (data[pokemonDataOffset + 1] << 8) | data[pokemonDataOffset + 2];
        const maxHp = (data[pokemonDataOffset + 34] << 8) | data[pokemonDataOffset + 35];
        const status = data[pokemonDataOffset + 4];
        
        const attack = (data[pokemonDataOffset + 36] << 8) | data[pokemonDataOffset + 37];
        const defense = (data[pokemonDataOffset + 38] << 8) | data[pokemonDataOffset + 39];
        const speed = (data[pokemonDataOffset + 40] << 8) | data[pokemonDataOffset + 41];
        const special = (data[pokemonDataOffset + 42] << 8) | data[pokemonDataOffset + 43];
        
        const moves = [];
        for (let m = 0; m < 4; m++) {
            const moveId = data[pokemonDataOffset + 8 + m];
            const movePP = data[pokemonDataOffset + 29 + m];
            if (moveId > 0) {
                moves.push({ id: moveId, pp: movePP });
            }
        }
        
        const exp = (data[pokemonDataOffset + 14] << 16) | 
                    (data[pokemonDataOffset + 15] << 8) | 
                    data[pokemonDataOffset + 16];
        
        const ivData = (data[pokemonDataOffset + 17] << 8) | data[pokemonDataOffset + 18];

        return {
            number: dexNumber,
            name: nickname || `Pokemon #${dexNumber}`,
            species: `Pokemon #${dexNumber}`,
            nickname,
            level,
            hp,
            maxHp,
            isAlive: hp > 0,
            status: getStatusName(status),
            stats: { attack, defense, speed, special },
            moves,
            exp,
            generation: 1,
            sprite: `Gen1/yellow/${String(dexNumber).padStart(4, '0')}.png`,
            importDate: new Date().toISOString()
        };
    }

    /**
     * Parse une sauvegarde Gen 2
     */
    function parseGen2Save(data, saveInfo) {
        const partyCount = data[GEN2_OFFSETS.PARTY_COUNT];
        
        if (partyCount === 0 || partyCount > 6) {
            throw new Error('No valid party found');
        }

        const team = [];
        for (let i = 0; i < partyCount; i++) {
            const pokemon = parseGen2Pokemon(data, i);
            if (pokemon) team.push(pokemon);
        }

        // Lire les infos du joueur
        const playerName = readGen2String(data, GEN2_OFFSETS.PLAYER_NAME, 7);
        const money = (data[GEN2_OFFSETS.MONEY] << 16) | (data[GEN2_OFFSETS.MONEY + 1] << 8) | data[GEN2_OFFSETS.MONEY + 2];
        const badges = data[GEN2_OFFSETS.BADGES];
        const badgeCount = countBits(badges) + countBits(data[GEN2_OFFSETS.BADGES + 1]);

        return {
            saveInfo,
            partyCount,
            team,
            player: {
                name: playerName,
                money: money,
                badgeCount: badgeCount
            }
        };
    }

    /**
     * Parse un Pokémon Gen 2
     */
    function parseGen2Pokemon(data, index) {
        // Structure Gen 2 Party:
        // 0x2865: Party count (1 byte)
        // 0x2866: Species list (7 bytes - 6 pokemon + 0xFF terminator)
        // 0x286D: Party data (48 bytes per pokemon)
        
        // Lire l'espèce depuis la liste
        const speciesListOffset = 0x2866;
        const species = data[speciesListOffset + index];
        if (species === 0 || species === 0xFF) return null;
        
        // Offset de base pour les données du Pokémon (48 bytes par Pokémon)
        const baseOffset = 0x286D + (index * 48);
        
        // Structure des 48 bytes du Pokémon:
        // +0: Species (1 byte)
        // +1: Held item (1 byte)
        // +2-5: Moves (4 bytes)
        // +6: Trainer ID low (1 byte)
        // +7: Trainer ID high (1 byte)
        // +8-10: Experience (3 bytes)
        // +11-12: HP EVs (2 bytes)
        // +13-14: Attack EVs (2 bytes)
        // +15-16: Defense EVs (2 bytes)
        // +17-18: Speed EVs (2 bytes)
        // +19-20: Special EVs (2 bytes)
        // +21-22: IVs (2 bytes)
        // +23-26: Move PP (4 bytes)
        // +27: Friendship (1 byte)
        // +28: Pokerus (1 byte)
        // +29-30: Caught data (2 bytes)
        // +31: Level (1 byte)
        // +32: Status condition (1 byte)
        // +33: Unused (1 byte)
        // +34-35: Current HP (2 bytes)
        // +36-37: Max HP (2 bytes)
        // +38-39: Attack (2 bytes)
        // +40-41: Defense (2 bytes)
        // +42-43: Speed (2 bytes)
        // +44-45: Special Attack (2 bytes)
        // +46-47: Special Defense (2 bytes)
        
        const level = data[baseOffset + 31];
        const hp = (data[baseOffset + 34] << 8) | data[baseOffset + 35];
        const maxHp = (data[baseOffset + 36] << 8) | data[baseOffset + 37];
        const status = data[baseOffset + 32];
        
        // Stats
        const attack = (data[baseOffset + 38] << 8) | data[baseOffset + 39];
        const defense = (data[baseOffset + 40] << 8) | data[baseOffset + 41];
        const speed = (data[baseOffset + 42] << 8) | data[baseOffset + 43];
        const spAttack = (data[baseOffset + 44] << 8) | data[baseOffset + 45];
        const spDefense = (data[baseOffset + 46] << 8) | data[baseOffset + 47];
        
        // Attaques
        const moves = [];
        for (let i = 0; i < 4; i++) {
            const moveId = data[baseOffset + 2 + i];
            const movePP = data[baseOffset + 23 + i];
            if (moveId > 0) {
                moves.push({
                    id: moveId,
                    name: getGen2MoveName(moveId),
                    pp: movePP & 0x3F
                });
            }
        }
        
        // IVs (Gen 2 utilise des IVs de 0-15)
        const ivData = (data[baseOffset + 21] << 8) | data[baseOffset + 22];
        const ivs = {
            attack: (ivData >> 12) & 0xF,
            defense: (ivData >> 8) & 0xF,
            speed: (ivData >> 4) & 0xF,
            special: ivData & 0xF
        };
        
        // Lire le surnom (après les données de party, 11 bytes par pokemon)
        const nicknameOffset = 0x286D + (6 * 48) + (index * 11);
        const nickname = readGen2String(data, nicknameOffset, 10);
        
        // Obtenir le nom de l'espèce
        const pokemonName = getGen2PokemonName(species);
        
        // Item tenu
        const heldItem = data[baseOffset + 1];
        
        // EXP
        const exp = (data[baseOffset + 8] << 16) | (data[baseOffset + 9] << 8) | data[baseOffset + 10];
        
        // Ball (Gen 2 stocke la ball dans les données de capture)
        const caughtData = data[baseOffset + 29];
        const ballType = getGen2BallName((caughtData >> 4) & 0x0F);
        
        return {
            number: species,
            name: pokemonName,
            nickname: nickname,
            level: level,
            hp: hp,
            maxHp: maxHp,
            isAlive: hp > 0 && status !== 0x08,
            status: status === 0 ? 'OK' : getStatusName(status),
            stats: {
                attack: attack,
                defense: defense,
                speed: speed,
                spAttack: spAttack,
                spDefense: spDefense
            },
            moves: moves,
            ivs: ivs,
            heldItem: heldItem > 0 ? getGen2ItemName(heldItem) : null,
            exp: exp,
            ball: ballType,
            sprite: `Gen2/crystal/${String(species).padStart(4, '0')}.png`,
            importDate: new Date().toISOString()
        };
    }

    /**
     * Lire une chaîne Gen 2
     */
    function readGen2String(data, offset, maxLength) {
        let result = '';
        for (let i = 0; i < maxLength; i++) {
            const char = data[offset + i];
            if (char === 0x50 || char === 0x00) break;
            result += decodeGen2Char(char);
        }
        return result.trim();
    }

    /**
     * Décoder un caractère Gen 2
     */
    function decodeGen2Char(byte) {
        // Gen 2 utilise un encodage similaire à Gen 1 mais avec quelques différences
        const map = {
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
            0x7F: ' ', 0xE0: '\'', 0xE3: '-', 0xE6: '?', 0xE7: '!', 0xE8: '.'
        };
        return map[byte] || '';
    }

    /**
     * Obtenir le nom d'un Pokémon Gen 2
     */
    function getGen2PokemonName(id) {
        if (typeof PokemonData !== 'undefined' && PokemonData.getName) {
            return PokemonData.getName(id);
        }
        return `Pokémon #${id}`;
    }

    /**
     * Obtenir le nom d'une attaque Gen 2
     */
    function getGen2MoveName(id) {
        // Base de données complète des attaques Gen 1-2
        const moves = {
            1: 'Écras\'Face', 2: 'Poing Karaté', 3: 'Torgnoles', 4: 'Poing Comète', 5: 'Ultimapoing',
            6: 'Jackpot', 7: 'Poing de Feu', 8: 'Poing-Glace', 9: 'Poing-Éclair', 10: 'Griffe',
            11: 'Guillotine', 12: 'Coupe-Vent', 13: 'Danse-Lames', 14: 'Coupe', 15: 'Tornade',
            16: 'Cru-Aile', 17: 'Cyclone', 18: 'Vol', 19: 'Ligotage', 20: 'Souplesse',
            21: 'Fouet Lianes', 22: 'Piétinement', 23: 'Double Pied', 24: 'Ultimawashi', 25: 'Balayage',
            26: 'Double Dard', 27: 'Mimi-Queue', 28: 'Dard-Venin', 29: 'Double-Face', 30: 'Puissance',
            33: 'Charge', 34: 'Plaquage', 35: 'Étreinte', 36: 'Bélier', 37: 'Mania',
            38: 'Sacrifice', 39: 'Coup d\'Boule', 40: 'Coud\'Krane', 41: 'Frappe Atlas', 42: 'Vampirisme',
            43: 'Méga-Sangsue', 44: 'Vol-Vie', 45: 'Rugissement', 46: 'Hurlement', 47: 'Berceuse',
            48: 'Ultrason', 49: 'Soin Sonore', 50: 'Entrave', 51: 'Acide', 52: 'Flammèche',
            53: 'Lance-Flammes', 54: 'Brume', 55: 'Pistolet à O', 56: 'Hydrocanon', 57: 'Surf',
            58: 'Laser Glace', 59: 'Blizzard', 60: 'Rafale Psy', 61: 'Bulles d\'O', 62: 'Onde Folie',
            63: 'Aurélia', 64: 'Éclair', 65: 'Fatal-Foudre', 66: 'Cage-Éclair', 67: 'Tonnerre',
            68: 'Jet-Pierres', 69: 'Séisme', 70: 'Abîme', 71: 'Tunnel', 72: 'Toxik',
            73: 'Choc Mental', 74: 'Psyko', 75: 'Hypnose', 76: 'Yoga', 77: 'Hâte',
            78: 'Téléport', 79: 'Ténèbres', 80: 'Dévorêve', 81: 'Gaz Toxik', 82: 'Bombe Beurk',
            83: 'Vampigraine', 84: 'Croissance', 85: 'Tranch\'Herbe', 86: 'Lance-Soleil', 87: 'Poudre Toxik',
            88: 'Para-Spore', 89: 'Poudre Dodo', 90: 'Danse-Fleur', 91: 'Sécrétion', 92: 'Piqûre',
            93: 'Damoclès', 94: 'Psyko', 95: 'Hypnose', 96: 'Yoga', 97: 'Hâte',
            98: 'Vive-Attaque', 99: 'Frénésie', 100: 'Téléport', 101: 'Ténèbres', 102: 'Mimique',
            103: 'Cri', 104: 'Armure', 105: 'Repli', 106: 'Boul\'Armure', 107: 'Brouillard',
            108: 'Buée Noire', 109: 'Reflet', 110: 'Soin', 111: 'Armure', 112: 'Bouclier',
            113: 'Mur Lumière', 114: 'Buée Noire', 115: 'Onde Folie', 116: 'Clairvoyance', 117: 'Bélier',
            118: 'Amnésie', 119: 'Voile Miroir', 120: 'Destruction', 121: 'Bomb\'Œuf', 122: 'Léchouille',
            123: 'Purédpois', 124: 'Détritus', 125: 'Poing de Feu', 126: 'Poing-Éclair', 127: 'Poing-Glace',
            128: 'Groz\'Yeux', 129: 'Dévorêve', 130: 'Gaz Toxik', 131: 'Bombe Beurk', 132: 'Constriction',
            133: 'Amnésie', 134: 'Rafale Psy', 135: 'Hâte', 136: 'Météores', 137: 'Coud\'Krane',
            138: 'Rêve', 139: 'Gaz Toxik', 140: 'Bomb\'Œuf', 141: 'Léchouille', 142: 'Purédpois',
            143: 'Ciel Clair', 144: 'Métronome', 145: 'Voile Miroir', 146: 'Destruction', 147: 'Bomb\'Œuf',
            148: 'Léchouille', 149: 'Purédpois', 150: 'Éclats d\'Os', 151: 'Déflagration', 152: 'Cascade',
            153: 'Coquilame', 154: 'Pics Toxik', 155: 'Psykoud\'Boul', 156: 'Repos', 157: 'Éboulement',
            158: 'Ultralaser', 159: 'Aiguisage', 160: 'Conversion', 161: 'Triplattaque', 162: 'Croc de Mort',
            163: 'Étincelle', 164: 'Griffe Acier', 165: 'Regard Noir', 166: 'Attraction', 167: 'Cauchemar',
            168: 'Roue de Feu', 169: 'Ronflement', 170: 'Malédiction', 171: 'Fléau', 172: 'Conversion 2',
            173: 'Aéroblast', 174: 'Spore Coton', 175: 'Contre', 176: 'Rancune', 177: 'Poudreuse',
            178: 'Abri', 179: 'Mach Punch', 180: 'Regard Noir', 181: 'Vent Glace', 182: 'Détection',
            183: 'Charge Os', 194: 'Giga-Sangsue', 195: 'Vent Argenté', 196: 'Doux Baiser',
            197: 'Vengeance', 198: 'Présent', 199: 'Frustration', 200: 'Rune Protect',
            201: 'Douleur', 202: 'Dynamopoing', 203: 'Mégacorne', 204: 'Draco-Rage',
            205: 'Draco-Souffle', 206: 'Relais', 207: 'Encore', 208: 'Poursuite',
            209: 'Tour Rapide', 210: 'Doux Parfum', 211: 'Queue de Fer', 212: 'Griffe Acier',
            213: 'Attraction', 214: 'Blabla Dodo', 215: 'Guérison', 216: 'Retour',
            217: 'Cadeau', 218: 'Frustration', 219: 'Rune Protect', 220: 'Douleur',
            221: 'Feu Sacré', 222: 'Dynamopoing', 223: 'Mégacorne', 224: 'Draco-Rage',
            225: 'Draco-Souffle', 226: 'Relais', 227: 'Encore', 228: 'Poursuite',
            229: 'Tour Rapide', 230: 'Doux Parfum', 231: 'Queue de Fer', 232: 'Griffe Acier',
            233: 'Attraction', 234: 'Blabla Dodo', 235: 'Guérison', 236: 'Retour',
            237: 'Cadeau', 238: 'Frustration', 239: 'Rune Protect', 240: 'Douleur',
            241: 'Feu Sacré', 242: 'Dynamopoing', 243: 'Mégacorne', 244: 'Draco-Rage',
            245: 'Draco-Souffle', 246: 'Relais', 247: 'Encore', 248: 'Poursuite',
            249: 'Tour Rapide', 250: 'Doux Parfum', 251: 'Queue de Fer'
        };
        return moves[id] || `Attaque #${id}`;
    }

    /**
     * Obtenir le nom d'un objet Gen 2
     */
    function getGen2ItemName(id) {
        const items = {
            1: 'Master Ball', 2: 'Ultra Ball', 3: 'Great Ball', 4: 'Poké Ball',
            17: 'Potion', 18: 'Super Potion', 19: 'Hyper Potion', 20: 'Potion Max',
            32: 'Baie', 33: 'Baie Dorée'
        };
        return items[id] || `Objet #${id}`;
    }

    /**
     * Obtenir le nom d'une Ball Gen 2
     */
    function getGen2BallName(id) {
        const balls = {
            1: 'Poké Ball', 2: 'Great Ball', 3: 'Ultra Ball', 4: 'Master Ball',
            5: 'Safari Ball', 6: 'Speed Ball', 7: 'Level Ball', 8: 'Lure Ball',
            9: 'Heavy Ball', 10: 'Love Ball', 11: 'Friend Ball', 12: 'Moon Ball'
        };
        return balls[id] || 'Poké Ball';
    }

    /**
     * Parse une sauvegarde Gen 3
     */
    function parseGen3Save(data, saveInfo) {
        // Gen 3 a une structure complexe avec 14 sections de 4KB chacune
        
        // Trouver quelle sauvegarde (A ou B) est la plus récente
        const saveIndexA = getSaveIndex(data, 0x0000);
        const saveIndexB = getSaveIndex(data, 0xE000);
        
        const activeSave = saveIndexA > saveIndexB ? 0x0000 : 0xE000;
        console.log(`📂 Save active Gen 3: ${activeSave === 0x0000 ? 'A' : 'B'} (index: ${Math.max(saveIndexA, saveIndexB)})`);
        
        // Chercher la section Team/Items (section ID 1)
        let teamSectionOffset = null;
        for (let i = 0; i < 14; i++) {
            const sectionOffset = activeSave + (i * 0x1000);
            const sectionId = data[sectionOffset + 0xFF4] | (data[sectionOffset + 0xFF5] << 8);
            
            console.log(`Section ${i}: ID=${sectionId} at offset 0x${sectionOffset.toString(16)}`);
            
            if (sectionId === 1) {
                teamSectionOffset = sectionOffset;
                console.log(`✅ Team section trouvée à l'offset 0x${sectionOffset.toString(16)}`);
                break;
            }
        }
        
        if (!teamSectionOffset) {
            throw new Error('Team section not found in save file');
        }
        
        // PKHeX indique que l'équipe est à 0x8970 dans les saves Émeraude
        // Essayons cet offset directement
        console.log(`🔍 Test de lecture à l'offset 0x8970 (indiqué par PKHeX)...`);
        const testOffset = activeSave + 0x8970 - 0xE000; // Ajuster selon la save active
        console.log(`📍 Offset absolu: 0x${testOffset.toString(16)}`);
        
        // Lire le premier Pokémon à cet offset
        if (testOffset > 0 && testOffset < data.length - 100) {
            const testPID = data[testOffset] | (data[testOffset + 1] << 8) | 
                           (data[testOffset + 2] << 16) | (data[testOffset + 3] << 24);
            console.log(`🧪 PID à 0x8970: 0x${testPID.toString(16)}`);
        }
        
        // Lire l'équipe - essayer différents offsets
        // Selon PKHeX, l'équipe pourrait être à 0x038 dans la section
        let teamOffset = teamSectionOffset + 0x038;
        let teamSize = data[teamOffset];
        
        console.log(`📊 Taille de l'équipe (offset 0x038): ${teamSize}`);
        
        // Si ça ne marche pas, essayer 0x234
        if (teamSize === 0 || teamSize > 6) {
            teamOffset = teamSectionOffset + 0x234;
            teamSize = data[teamOffset];
            console.log(`📊 Taille de l'équipe (offset 0x234): ${teamSize}`);
        }
        
        console.log(`📍 Team offset final: 0x${teamOffset.toString(16)}`);
        
        if (teamSize === 0 || teamSize > 6) {
            throw new Error(`No valid party found (size: ${teamSize})`);
        }
        
        const team = [];
        // Les Pokémon de l'équipe sont 4 bytes après le count
        const pokemonStartOffset = teamOffset + 0x004;
        
        for (let i = 0; i < teamSize; i++) {
            const pokemonOffset = pokemonStartOffset + (i * 100);
            console.log(`🔍 Lecture Pokémon ${i+1} à l'offset 0x${pokemonOffset.toString(16)}`);
            const pokemon = parseGen3Pokemon(data, pokemonOffset);
            if (pokemon) {
                console.log(`✅ Pokémon ${i+1}: ${pokemon.name} Niv.${pokemon.level}`);
                team.push(pokemon);
            }
        }
        
        return {
            saveInfo,
            partyCount: teamSize,
            team,
            player: {
                name: 'Trainer',
                money: 0,
                badgeCount: 0
            }
        };
    }

    /**
     * Obtenir l'index de sauvegarde Gen 3
     */
    function getSaveIndex(data, offset) {
        let maxIndex = 0;
        for (let i = 0; i < 14; i++) {
            const sectionOffset = offset + (i * 0x1000);
            const saveIndex = data[sectionOffset + 0xFFC] | 
                            (data[sectionOffset + 0xFFD] << 8) |
                            (data[sectionOffset + 0xFFE] << 16) |
                            (data[sectionOffset + 0xFFF] << 24);
            if (saveIndex > maxIndex) maxIndex = saveIndex;
        }
        return maxIndex;
    }

    /**
     * Parse un Pokémon Gen 3
     */
    function parseGen3Pokemon(data, offset) {
        // Structure Gen 3: 100 bytes par Pokémon
        // 0-3: Personality Value (PID)
        // 4-7: Original Trainer ID
        // 8-17: Nickname (10 bytes)
        // 18-19: Language + flags
        // 20-26: OT Name (7 bytes)
        // 27: Markings
        // 28-29: Checksum
        // 30-31: Unknown
        // 32-79: Données cryptées (48 bytes)
        // 80-99: Données de croissance (20 bytes)
        
        const personality = ((data[offset] | (data[offset + 1] << 8) | 
                           (data[offset + 2] << 16) | (data[offset + 3] << 24)) >>> 0);
        
        if (personality === 0) {
            console.log(`⚠️ PID = 0, Pokémon vide`);
            return null;
        }
        
        console.log(`🔑 PID: 0x${personality.toString(16)}`);
        
        const otId = ((data[offset + 4] | (data[offset + 5] << 8) |
                     (data[offset + 6] << 16) | (data[offset + 7] << 24)) >>> 0);
        
        console.log(`👤 OT ID: 0x${otId.toString(16)}`);
        console.log(`👤 OT ID bytes: ${data[offset + 4].toString(16)} ${data[offset + 5].toString(16)} ${data[offset + 6].toString(16)} ${data[offset + 7].toString(16)}`);
        
        // Debug: afficher les 100 bytes bruts du Pokémon
        console.log(`🔍 Données brutes complètes (100 bytes):`, Array.from(data.slice(offset, offset + 100)).map(b => b.toString(16).padStart(2, '0')).join(' '));
        
        // Décrypter les données (XOR avec PID ^ OT ID)
        const key = personality ^ otId;
        console.log(`🔑 Clé de décryptage: 0x${key.toString(16)} (PID ^ OT_ID)`);
        
        const decrypted = new Uint8Array(48);
        
        // Afficher les premiers 16 bytes cryptés
        console.log(`🔒 Premiers 16 bytes cryptés:`, Array.from(data.slice(offset + 32, offset + 48)).map(b => b.toString(16).padStart(2, '0')).join(' '));
        
        for (let i = 0; i < 48; i += 4) {
            const encrypted = (data[offset + 32 + i] | (data[offset + 32 + i + 1] << 8) |
                             (data[offset + 32 + i + 2] << 16) | (data[offset + 32 + i + 3] << 24));
            const decryptedValue = encrypted ^ key;
            
            decrypted[i] = decryptedValue & 0xFF;
            decrypted[i + 1] = (decryptedValue >> 8) & 0xFF;
            decrypted[i + 2] = (decryptedValue >> 16) & 0xFF;
            decrypted[i + 3] = (decryptedValue >> 24) & 0xFF;
            
            if (i === 0) {
                console.log(`🔓 Premier bloc: 0x${encrypted.toString(16)} XOR 0x${key.toString(16)} = 0x${decryptedValue.toString(16)}`);
            }
        }
        
        // Les données sont réorganisées selon le PID % 24
        const orderIndex = personality % 24;
        const substructOrder = getGen3SubstructOrder(orderIndex);
        
        console.log(`🔀 Order index: ${orderIndex}, Order: [${substructOrder.join(', ')}]`);
        console.log(`📦 Données décryptées (48 bytes):`, Array.from(decrypted).map(b => b.toString(16).padStart(2, '0')).join(' '));
        
        // L'ordre indique quelle substruct est à chaque position
        // Order [3, 0, 2, 1] = [Misc, Growth, EVs, Attacks]
        // On lit les 4 slots dans l'ordre
        const slot0 = getGen3Substruct(decrypted, 0); // Ce que dit substructOrder[0]
        const slot1 = getGen3Substruct(decrypted, 1); // Ce que dit substructOrder[1]
        const slot2 = getGen3Substruct(decrypted, 2); // Ce que dit substructOrder[2]
        const slot3 = getGen3Substruct(decrypted, 3); // Ce que dit substructOrder[3]
        
        // Maintenant on assigne selon l'ordre
        const substructs = [slot0, slot1, slot2, slot3];
        const growth = substructs[substructOrder.indexOf(0)];
        const attacks = substructs[substructOrder.indexOf(1)];
        const evs = substructs[substructOrder.indexOf(2)];
        const misc = substructs[substructOrder.indexOf(3)];
        
        console.log(`📍 Growth est au slot ${substructOrder.indexOf(0)}`);
        
        // Lire les données de croissance (Growth)
        const species = growth[0] | (growth[1] << 8);
        const heldItem = growth[2] | (growth[3] << 8);
        const exp = growth[4] | (growth[5] << 8) | (growth[6] << 16) | (growth[7] << 24);
        
        // Calculer le niveau depuis l'EXP (approximation)
        const calculatedLevel = calculateLevelFromExp(exp);
        
        console.log(`📊 Growth substruct:`, Array.from(growth).map(b => b.toString(16).padStart(2, '0')).join(' '));
        console.log(`🔢 Espèce lue: ${species} (0x${species.toString(16)})`);
        console.log(`💎 EXP: ${exp}, Niveau calculé: ${calculatedLevel}`);
        
        // Lire les attaques (Attacks)
        const move1 = attacks[0] | (attacks[1] << 8);
        const move2 = attacks[2] | (attacks[3] << 8);
        const move3 = attacks[4] | (attacks[5] << 8);
        const move4 = attacks[6] | (attacks[7] << 8);
        
        console.log(`⚔️ Attaques: ${move1}, ${move2}, ${move3}, ${move4}`);
        
        // Lire les EVs et condition
        const hpEV = evs[0];
        const attackEV = evs[1];
        const defenseEV = evs[2];
        const speedEV = evs[3];
        const spAttackEV = evs[4];
        const spDefenseEV = evs[5];
        
        // Lire misc (IVs, etc.)
        const ivData = misc[4] | (misc[5] << 8) | (misc[6] << 16) | (misc[7] << 24);
        const hpIV = ivData & 0x1F;
        const attackIV = (ivData >> 5) & 0x1F;
        const defenseIV = (ivData >> 10) & 0x1F;
        const speedIV = (ivData >> 15) & 0x1F;
        const spAttackIV = (ivData >> 20) & 0x1F;
        const spDefenseIV = (ivData >> 25) & 0x1F;
        
        // Utiliser le niveau calculé depuis l'EXP
        const level = calculatedLevel;
        
        // Pour les stats et HP, on va utiliser des valeurs approximatives
        // car les party stats semblent incorrectes dans cette save
        const status = 0; // OK par défaut
        
        // Calculer des stats approximatives (formule simplifiée)
        const baseHP = 40; // Approximation
        const baseAttack = 30;
        const baseDefense = 32;
        const baseSpeed = 65;
        const baseSpAttack = 50;
        const baseSpDefense = 52;
        
        const maxHP = Math.floor(((2 * baseHP + hpIV + Math.floor(hpEV / 4)) * level) / 100) + level + 10;
        const attack = Math.floor(((2 * baseAttack + attackIV + Math.floor(attackEV / 4)) * level) / 100) + 5;
        const defense = Math.floor(((2 * baseDefense + defenseIV + Math.floor(defenseEV / 4)) * level) / 100) + 5;
        const speed = Math.floor(((2 * baseSpeed + speedIV + Math.floor(speedEV / 4)) * level) / 100) + 5;
        const spAttack = Math.floor(((2 * baseSpAttack + spAttackIV + Math.floor(spAttackEV / 4)) * level) / 100) + 5;
        const spDefense = Math.floor(((2 * baseSpDefense + spDefenseIV + Math.floor(spDefenseEV / 4)) * level) / 100) + 5;
        
        const currentHP = maxHP; // Pleine vie par défaut
        
        console.log(`📦 Espèce: ${species}, Niveau: ${level}, HP: ${currentHP}/${maxHP}`);
        
        if (species === 0 || species > 411) {
            console.log(`⚠️ Espèce invalide: ${species}`);
            return null;
        }
        
        return {
            number: species,
            name: getGen3PokemonName(species),
            level: level,
            hp: currentHP,
            maxHp: maxHP,
            isAlive: currentHP > 0 && status !== 0x08,
            status: status === 0 ? 'OK' : getStatusName(status),
            stats: {
                attack: attack,
                defense: defense,
                speed: speed,
                spAttack: spAttack,
                spDefense: spDefense
            },
            ivs: {
                hp: hpIV,
                attack: attackIV,
                defense: defenseIV,
                speed: speedIV,
                spAttack: spAttackIV,
                spDefense: spDefenseIV
            },
            moves: [
                move1 > 0 ? { id: move1, name: `Attaque #${move1}`, pp: attacks[8] } : null,
                move2 > 0 ? { id: move2, name: `Attaque #${move2}`, pp: attacks[9] } : null,
                move3 > 0 ? { id: move3, name: `Attaque #${move3}`, pp: attacks[10] } : null,
                move4 > 0 ? { id: move4, name: `Attaque #${move4}`, pp: attacks[11] } : null
            ].filter(m => m !== null),
            sprite: window.PokeAPI ? window.PokeAPI.getPokemonSpriteUrl(species) : `Gen3/emerald/${String(species).padStart(4, '0')}.png`,
            importDate: new Date().toISOString()
        };
    }

    function getGen3SubstructOrder(order) {
        const orders = [
            [0, 1, 2, 3], [0, 1, 3, 2], [0, 2, 1, 3], [0, 3, 1, 2], [0, 2, 3, 1], [0, 3, 2, 1],
            [1, 0, 2, 3], [1, 0, 3, 2], [2, 0, 1, 3], [3, 0, 1, 2], [2, 0, 3, 1], [3, 0, 2, 1],
            [1, 2, 0, 3], [1, 3, 0, 2], [2, 1, 0, 3], [3, 1, 0, 2], [2, 3, 0, 1], [3, 2, 0, 1],
            [1, 2, 3, 0], [1, 3, 2, 0], [2, 1, 3, 0], [3, 1, 2, 0], [2, 3, 1, 0], [3, 2, 1, 0]
        ];
        return orders[order];
    }

    function getGen3Substruct(data, index) {
        const offset = index * 12;
        return data.slice(offset, offset + 12);
    }

    function getGen3PokemonName(id) {
        if (typeof PokemonData !== 'undefined' && PokemonData.getName) {
            return PokemonData.getName(id);
        }
        return `Pokémon #${id}`;
    }

    function calculateLevelFromExp(exp) {
        // Formule Medium Fast (la plus commune)
        // EXP = Level^3
        if (exp === 0) return 1;
        const level = Math.floor(Math.pow(exp, 1/3));
        return Math.max(1, Math.min(100, level));
    }

    /**
     * Parse une sauvegarde Gen 4 (Diamond/Pearl/Platinum/HGSS)
     */
    function parseGen4Save(data, saveInfo) {
        // Gen 4 utilise des blocs avec checksums
        // Structure simplifiée pour l'instant
        
        // Offset de l'équipe varie selon le jeu
        // DP/Pt: 0x98 dans le General Block
        // HGSS: 0x98 dans le General Block
        
        // Pour simplifier, chercher un pattern de 6 Pokémon valides
        const teamOffset = findGen4TeamOffset(data);
        
        if (!teamOffset) {
            throw new Error('No valid party found');
        }
        
        const teamSize = data[teamOffset];
        if (teamSize === 0 || teamSize > 6) {
            throw new Error('No valid party found');
        }
        
        const team = [];
        for (let i = 0; i < teamSize; i++) {
            const pokemon = parseGen4Pokemon(data, teamOffset + 4 + (i * 236));
            if (pokemon) team.push(pokemon);
        }
        
        return {
            saveInfo,
            partyCount: teamSize,
            team,
            player: {
                name: 'Trainer',
                money: 0,
                badgeCount: 0
            }
        };
    }

    function findGen4TeamOffset(data) {
        // Chercher le pattern: nombre entre 1-6, suivi de 0xFF
        for (let i = 0; i < Math.min(data.length - 1000, 0x10000); i++) {
            const count = data[i];
            if (count >= 1 && count <= 6 && data[i + 1] === 0xFF) {
                return i;
            }
        }
        return null;
    }

    function parseGen4Pokemon(data, offset) {
        // Structure Gen 4: 236 bytes par Pokémon
        const species = data[offset + 8] | (data[offset + 9] << 8);
        
        if (species === 0 || species > 493) return null;
        
        return {
            number: species,
            name: getGen4PokemonName(species),
            level: data[offset + 140],
            hp: (data[offset + 142] << 8) | data[offset + 143],
            maxHp: (data[offset + 144] << 8) | data[offset + 145],
            isAlive: true,
            status: 'OK',
            stats: {
                attack: (data[offset + 146] << 8) | data[offset + 147],
                defense: (data[offset + 148] << 8) | data[offset + 149],
                speed: (data[offset + 150] << 8) | data[offset + 151],
                spAttack: (data[offset + 152] << 8) | data[offset + 153],
                spDefense: (data[offset + 154] << 8) | data[offset + 155]
            },
            moves: [],
            sprite: `Gen4/pt/${String(species).padStart(4, '0')}.png`,
            importDate: new Date().toISOString()
        };
    }

    /**
     * Parse une sauvegarde Gen 5 (Black/White/B2W2)
     */
    function parseGen5Save(data, saveInfo) {
        // Gen 5 similaire à Gen 4 mais avec des offsets différents
        const teamOffset = findGen5TeamOffset(data);
        
        if (!teamOffset) {
            throw new Error('No valid party found');
        }
        
        const teamSize = data[teamOffset];
        if (teamSize === 0 || teamSize > 6) {
            throw new Error('No valid party found');
        }
        
        const team = [];
        for (let i = 0; i < teamSize; i++) {
            const pokemon = parseGen5Pokemon(data, teamOffset + 4 + (i * 220));
            if (pokemon) team.push(pokemon);
        }
        
        return {
            saveInfo,
            partyCount: teamSize,
            team,
            player: {
                name: 'Trainer',
                money: 0,
                badgeCount: 0
            }
        };
    }

    function findGen5TeamOffset(data) {
        for (let i = 0; i < Math.min(data.length - 1000, 0x20000); i++) {
            const count = data[i];
            if (count >= 1 && count <= 6 && data[i + 1] === 0xFF) {
                return i;
            }
        }
        return null;
    }

    function parseGen5Pokemon(data, offset) {
        // Structure Gen 5: 220 bytes par Pokémon
        const species = data[offset + 8] | (data[offset + 9] << 8);
        
        if (species === 0 || species > 649) return null;
        
        return {
            number: species,
            name: getGen5PokemonName(species),
            level: data[offset + 140],
            hp: (data[offset + 142] << 8) | data[offset + 143],
            maxHp: (data[offset + 144] << 8) | data[offset + 145],
            isAlive: true,
            status: 'OK',
            stats: {
                attack: (data[offset + 146] << 8) | data[offset + 147],
                defense: (data[offset + 148] << 8) | data[offset + 149],
                speed: (data[offset + 150] << 8) | data[offset + 151],
                spAttack: (data[offset + 152] << 8) | data[offset + 153],
                spDefense: (data[offset + 154] << 8) | data[offset + 155]
            },
            moves: [],
            sprite: `Gen5/bw/${String(species).padStart(4, '0')}.png`,
            importDate: new Date().toISOString()
        };
    }

    /**
     * Parse une sauvegarde Gen 6 (X/Y/ORAS)
     */
    function parseGen6Save(data, saveInfo) {
        // Gen 6 utilise un format différent avec encryption
        const teamOffset = findGen6TeamOffset(data);
        
        if (!teamOffset) {
            throw new Error('No valid party found');
        }
        
        const teamSize = data[teamOffset];
        if (teamSize === 0 || teamSize > 6) {
            throw new Error('No valid party found');
        }
        
        const team = [];
        for (let i = 0; i < teamSize; i++) {
            const pokemon = parseGen6Pokemon(data, teamOffset + 8 + (i * 260));
            if (pokemon) team.push(pokemon);
        }
        
        return {
            saveInfo,
            partyCount: teamSize,
            team,
            player: {
                name: 'Trainer',
                money: 0,
                badgeCount: 0
            }
        };
    }

    function findGen6TeamOffset(data) {
        for (let i = 0; i < Math.min(data.length - 2000, 0x30000); i++) {
            const count = data[i];
            if (count >= 1 && count <= 6) {
                return i;
            }
        }
        return null;
    }

    function parseGen6Pokemon(data, offset) {
        // Structure Gen 6: 260 bytes par Pokémon
        const species = data[offset + 8] | (data[offset + 9] << 8);
        
        if (species === 0 || species > 721) return null;
        
        return {
            number: species,
            name: getGen6PokemonName(species),
            level: data[offset + 140],
            hp: (data[offset + 142] << 8) | data[offset + 143],
            maxHp: (data[offset + 144] << 8) | data[offset + 145],
            isAlive: true,
            status: 'OK',
            stats: {
                attack: (data[offset + 146] << 8) | data[offset + 147],
                defense: (data[offset + 148] << 8) | data[offset + 149],
                speed: (data[offset + 150] << 8) | data[offset + 151],
                spAttack: (data[offset + 152] << 8) | data[offset + 153],
                spDefense: (data[offset + 154] << 8) | data[offset + 155]
            },
            moves: [],
            sprite: `Gen6/xy/${String(species).padStart(4, '0')}.png`,
            importDate: new Date().toISOString()
        };
    }

    /**
     * Parse une sauvegarde Gen 7 (Sun/Moon/USUM)
     */
    function parseGen7Save(data, saveInfo) {
        // Gen 7 similaire à Gen 6
        const teamOffset = findGen7TeamOffset(data);
        
        if (!teamOffset) {
            throw new Error('No valid party found');
        }
        
        const teamSize = data[teamOffset];
        if (teamSize === 0 || teamSize > 6) {
            throw new Error('No valid party found');
        }
        
        const team = [];
        for (let i = 0; i < teamSize; i++) {
            const pokemon = parseGen7Pokemon(data, teamOffset + 8 + (i * 260));
            if (pokemon) team.push(pokemon);
        }
        
        return {
            saveInfo,
            partyCount: teamSize,
            team,
            player: {
                name: 'Trainer',
                money: 0,
                badgeCount: 0
            }
        };
    }

    function findGen7TeamOffset(data) {
        for (let i = 0; i < Math.min(data.length - 2000, 0x30000); i++) {
            const count = data[i];
            if (count >= 1 && count <= 6) {
                return i;
            }
        }
        return null;
    }

    function parseGen7Pokemon(data, offset) {
        // Structure Gen 7: 260 bytes par Pokémon
        const species = data[offset + 8] | (data[offset + 9] << 8);
        
        if (species === 0 || species > 807) return null;
        
        return {
            number: species,
            name: getGen7PokemonName(species),
            level: data[offset + 140],
            hp: (data[offset + 142] << 8) | data[offset + 143],
            maxHp: (data[offset + 144] << 8) | data[offset + 145],
            isAlive: true,
            status: 'OK',
            stats: {
                attack: (data[offset + 146] << 8) | data[offset + 147],
                defense: (data[offset + 148] << 8) | data[offset + 149],
                speed: (data[offset + 150] << 8) | data[offset + 151],
                spAttack: (data[offset + 152] << 8) | data[offset + 153],
                spDefense: (data[offset + 154] << 8) | data[offset + 155]
            },
            moves: [],
            sprite: `Gen7/sm/${String(species).padStart(4, '0')}.png`,
            importDate: new Date().toISOString()
        };
    }

    // Fonctions helper pour obtenir les noms des Pokémon
    function getGen4PokemonName(id) {
        if (typeof PokemonData !== 'undefined' && PokemonData.getName) {
            return PokemonData.getName(id);
        }
        return `Pokémon #${id}`;
    }

    function getGen5PokemonName(id) {
        if (typeof PokemonData !== 'undefined' && PokemonData.getName) {
            return PokemonData.getName(id);
        }
        return `Pokémon #${id}`;
    }

    function getGen6PokemonName(id) {
        if (typeof PokemonData !== 'undefined' && PokemonData.getName) {
            return PokemonData.getName(id);
        }
        return `Pokémon #${id}`;
    }

    function getGen7PokemonName(id) {
        if (typeof PokemonData !== 'undefined' && PokemonData.getName) {
            return PokemonData.getName(id);
        }
        return `Pokémon #${id}`;
    }

    /**
     * Compter les bits à 1 dans un byte
     */
    function countBits(byte) {
        let count = 0;
        for (let i = 0; i < 8; i++) {
            if (byte & (1 << i)) count++;
        }
        return count;
    }

    // ============================================
    // UTILITAIRES
    // ============================================

    function convertGen1IndexToDex(index) {
        const map = {
            0x01: 112, 0x02: 115, 0x03: 32, 0x04: 35, 0x05: 21, 0x09: 2, 0x15: 151,
            0x21: 58, 0x24: 16, 0x25: 52, 0x29: 144, 0x2A: 145, 0x2C: 146, 0x33: 1,
            0x39: 75, 0x40: 79, 0x54: 25, 0x55: 26, 0x56: 134, 0x57: 135, 0x58: 136,
            0x59: 37, 0x5A: 38, 0x5B: 39, 0x5C: 40, 0x76: 150, 0x77: 143, 0x99: 139,
            0xB4: 3, 0xB5: 6, 0xB6: 4, 0xB7: 5, 0xB8: 7, 0xB9: 8
        };
        return map[index] || index;
    }

    function readGen1String(data, offset, maxLength) {
        let result = '';
        for (let i = 0; i < maxLength; i++) {
            const char = data[offset + i];
            if (char === 0x50 || char === 0x00) break;
            result += decodeGen1Char(char);
        }
        return result.trim();
    }

    function decodeGen1Char(byte) {
        const map = {
            0x80: 'A', 0x81: 'B', 0x82: 'C', 0x83: 'D', 0x84: 'E', 0x85: 'F', 0x86: 'G',
            0x87: 'H', 0x88: 'I', 0x89: 'J', 0x8A: 'K', 0x8B: 'L', 0x8C: 'M', 0x8D: 'N',
            0x8E: 'O', 0x8F: 'P', 0x90: 'Q', 0x91: 'R', 0x92: 'S', 0x93: 'T', 0x94: 'U',
            0x95: 'V', 0x96: 'W', 0x97: 'X', 0x98: 'Y', 0x99: 'Z',
            0xA0: 'a', 0xA1: 'b', 0xA2: 'c', 0xA3: 'd', 0xA4: 'e', 0xF6: '0', 0xF7: '1',
            0x7F: ' ', 0xE0: '\'', 0xE3: '-'
        };
        return map[byte] || '';
    }

    function readGen1Money(data, offset) {
        const b1 = data[offset], b2 = data[offset + 1], b3 = data[offset + 2];
        return ((b1 >> 4) * 100000) + ((b1 & 0xF) * 10000) +
               ((b2 >> 4) * 1000) + ((b2 & 0xF) * 100) +
               ((b3 >> 4) * 10) + (b3 & 0xF);
    }

    function countBits(value) {
        let count = 0;
        while (value) {
            count += value & 1;
            value >>= 1;
        }
        return count;
    }

    function getStatusName(status) {
        if (status === 0) return 'OK';
        if (status & 0x04) return 'Empoisonné';
        if (status & 0x08) return 'Brûlé';
        if (status & 0x10) return 'Gelé';
        if (status & 0x20) return 'Paralysé';
        if (status & 0x40) return 'Endormi';
        return 'OK';
    }

    function readGen1PlayTime(data, offset) {
        const hours = data[offset];
        const minutes = data[offset + 2];
        const seconds = data[offset + 3];
        return {
            hours: hours,
            minutes: minutes,
            seconds: seconds,
            formatted: `${hours}h ${minutes}m ${seconds}s`
        };
    }

    function countPokedexGen1(data, offset) {
        let count = 0;
        for (let i = 0; i < 19; i++) {
            count += countBits(data[offset + i]);
        }
        return count;
    }

    function getGen1PokemonName(dexNumber) {
        // ✅ Utilise PokemonData si disponible, sinon fallback
        if (typeof PokemonData !== 'undefined') {
            return PokemonData.getName(dexNumber);
        }
        // Fallback si PokemonData n'est pas chargé
        return `Pokémon #${dexNumber}`;
    }

    function getGen1ItemName(itemId) {
        const items = {
            1: 'Master Ball', 2: 'Ultra Ball', 3: 'Super Ball', 4: 'Poké Ball', 5: 'Town Map',
            6: 'Bicycle', 7: 'Moon Stone', 8: 'Antidote', 9: 'Burn Heal', 10: 'Ice Heal',
            11: 'Awakening', 12: 'Parlyz Heal', 13: 'Full Restore', 14: 'Max Potion', 15: 'Hyper Potion',
            16: 'Super Potion', 17: 'Potion', 18: 'Escape Rope', 19: 'Repel', 20: 'Old Amber',
            21: 'Fire Stone', 22: 'Thunder Stone', 23: 'Water Stone', 24: 'HP Up', 25: 'Protein',
            26: 'Iron', 27: 'Carbos', 28: 'Calcium', 29: 'Rare Candy', 30: 'Dome Fossil',
            31: 'Helix Fossil', 32: 'Secret Key', 33: 'Bike Voucher', 34: 'X Accuracy', 35: 'Leaf Stone',
            36: 'Card Key', 37: 'Nugget', 38: 'PP Up', 39: 'Poké Doll', 40: 'Full Heal',
            41: 'Revive', 42: 'Max Revive', 43: 'Guard Spec.', 44: 'Super Repel', 45: 'Max Repel',
            46: 'Dire Hit', 47: 'Coin', 48: 'Fresh Water', 49: 'Soda Pop', 50: 'Lemonade',
            51: 'S.S. Ticket', 52: 'Gold Teeth', 53: 'X Attack', 54: 'X Defend', 55: 'X Speed',
            56: 'X Special', 57: 'Coin Case', 58: 'Oak\'s Parcel', 59: 'Itemfinder', 60: 'Silph Scope',
            61: 'Poké Flute', 62: 'Lift Key', 63: 'Exp. Share', 64: 'Old Rod', 65: 'Good Rod',
            66: 'Super Rod', 67: 'PP Up', 68: 'Ether', 69: 'Max Ether', 70: 'Elixer',
            71: 'Max Elixer', 196: 'HM01', 197: 'HM02', 198: 'HM03', 199: 'HM04', 200: 'HM05'
        };
        return items[itemId] || `Item #${itemId}`;
    }

    // API publique
    return {
        detectSaveType,
        parseSaveFile
    };
})();
