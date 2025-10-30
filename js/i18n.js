// Système de traduction
let currentLang = localStorage.getItem('language') || 'en';

// Noms des Pokémon en anglais (Gen 1-3)
const pokemonNamesEN = {
    1: 'Bulbasaur', 2: 'Ivysaur', 3: 'Venusaur', 4: 'Charmander', 5: 'Charmeleon',
    6: 'Charizard', 7: 'Squirtle', 8: 'Wartortle', 9: 'Blastoise', 10: 'Caterpie',
    11: 'Metapod', 12: 'Butterfree', 13: 'Weedle', 14: 'Kakuna', 15: 'Beedrill',
    16: 'Pidgey', 17: 'Pidgeotto', 18: 'Pidgeot', 19: 'Rattata', 20: 'Raticate',
    21: 'Spearow', 22: 'Fearow', 23: 'Ekans', 24: 'Arbok', 25: 'Pikachu',
    26: 'Raichu', 27: 'Sandshrew', 28: 'Sandslash', 29: 'Nidoran♀', 30: 'Nidorina',
    31: 'Nidoqueen', 32: 'Nidoran♂', 33: 'Nidorino', 34: 'Nidoking', 35: 'Clefairy',
    36: 'Clefable', 37: 'Vulpix', 38: 'Ninetales', 39: 'Jigglypuff', 40: 'Wigglytuff',
    41: 'Zubat', 42: 'Golbat', 43: 'Oddish', 44: 'Gloom', 45: 'Vileplume',
    46: 'Paras', 47: 'Parasect', 48: 'Venonat', 49: 'Venomoth', 50: 'Diglett',
    51: 'Dugtrio', 52: 'Meowth', 53: 'Persian', 54: 'Psyduck', 55: 'Golduck',
    56: 'Mankey', 57: 'Primeape', 58: 'Growlithe', 59: 'Arcanine', 60: 'Poliwag',
    61: 'Poliwhirl', 62: 'Poliwrath', 63: 'Abra', 64: 'Kadabra', 65: 'Alakazam',
    66: 'Machop', 67: 'Machoke', 68: 'Machamp', 69: 'Bellsprout', 70: 'Weepinbell',
    71: 'Victreebel', 72: 'Tentacool', 73: 'Tentacruel', 74: 'Geodude', 75: 'Graveler',
    76: 'Golem', 77: 'Ponyta', 78: 'Rapidash', 79: 'Slowpoke', 80: 'Slowbro',
    81: 'Magnemite', 82: 'Magneton', 83: 'Farfetch\'d', 84: 'Doduo', 85: 'Dodrio',
    86: 'Seel', 87: 'Dewgong', 88: 'Grimer', 89: 'Muk', 90: 'Shellder',
    91: 'Cloyster', 92: 'Gastly', 93: 'Haunter', 94: 'Gengar', 95: 'Onix',
    96: 'Drowzee', 97: 'Hypno', 98: 'Krabby', 99: 'Kingler', 100: 'Voltorb',
    101: 'Electrode', 102: 'Exeggcute', 103: 'Exeggutor', 104: 'Cubone', 105: 'Marowak',
    106: 'Hitmonlee', 107: 'Hitmonchan', 108: 'Lickitung', 109: 'Koffing', 110: 'Weezing',
    111: 'Rhyhorn', 112: 'Rhydon', 113: 'Chansey', 114: 'Tangela', 115: 'Kangaskhan',
    116: 'Horsea', 117: 'Seadra', 118: 'Goldeen', 119: 'Seaking', 120: 'Staryu',
    121: 'Starmie', 122: 'Mr. Mime', 123: 'Scyther', 124: 'Jynx', 125: 'Electabuzz',
    126: 'Magmar', 127: 'Pinsir', 128: 'Tauros', 129: 'Magikarp', 130: 'Gyarados',
    131: 'Lapras', 132: 'Ditto', 133: 'Eevee', 134: 'Vaporeon', 135: 'Jolteon',
    136: 'Flareon', 137: 'Porygon', 138: 'Omanyte', 139: 'Omastar', 140: 'Kabuto',
    141: 'Kabutops', 142: 'Aerodactyl', 143: 'Snorlax', 144: 'Articuno', 145: 'Zapdos',
    146: 'Moltres', 147: 'Dratini', 148: 'Dragonair', 149: 'Dragonite', 150: 'Mewtwo',
    151: 'Mew',
    152: 'Chikorita', 153: 'Bayleef', 154: 'Meganium', 155: 'Cyndaquil', 156: 'Quilava',
    157: 'Typhlosion', 158: 'Totodile', 159: 'Croconaw', 160: 'Feraligatr', 161: 'Sentret',
    162: 'Furret', 163: 'Hoothoot', 164: 'Noctowl', 165: 'Ledyba', 166: 'Ledian',
    167: 'Spinarak', 168: 'Ariados', 169: 'Crobat', 170: 'Chinchou', 171: 'Lanturn',
    172: 'Pichu', 173: 'Cleffa', 174: 'Igglybuff', 175: 'Togepi', 176: 'Togetic',
    177: 'Natu', 178: 'Xatu', 179: 'Mareep', 180: 'Flaaffy', 181: 'Ampharos',
    182: 'Bellossom', 183: 'Marill', 184: 'Azumarill', 185: 'Sudowoodo', 186: 'Politoed',
    187: 'Hoppip', 188: 'Skiploom', 189: 'Jumpluff', 190: 'Aipom', 191: 'Sunkern',
    192: 'Sunflora', 193: 'Yanma', 194: 'Wooper', 195: 'Quagsire', 196: 'Espeon',
    197: 'Umbreon', 198: 'Murkrow', 199: 'Slowking', 200: 'Misdreavus', 201: 'Unown',
    202: 'Wobbuffet', 203: 'Girafarig', 204: 'Pineco', 205: 'Forretress', 206: 'Dunsparce',
    207: 'Gligar', 208: 'Steelix', 209: 'Snubbull', 210: 'Granbull', 211: 'Qwilfish',
    212: 'Scizor', 213: 'Shuckle', 214: 'Heracross', 215: 'Sneasel', 216: 'Teddiursa',
    217: 'Ursaring', 218: 'Slugma', 219: 'Magcargo', 220: 'Swinub', 221: 'Piloswine',
    222: 'Corsola', 223: 'Remoraid', 224: 'Octillery', 225: 'Delibird', 226: 'Mantine',
    227: 'Skarmory', 228: 'Houndour', 229: 'Houndoom', 230: 'Kingdra', 231: 'Phanpy',
    232: 'Donphan', 233: 'Porygon2', 234: 'Stantler', 235: 'Smeargle', 236: 'Tyrogue',
    237: 'Hitmontop', 238: 'Smoochum', 239: 'Elekid', 240: 'Magby', 241: 'Miltank',
    242: 'Blissey', 243: 'Raikou', 244: 'Entei', 245: 'Suicune', 246: 'Larvitar',
    247: 'Pupitar', 248: 'Tyranitar', 249: 'Lugia', 250: 'Ho-Oh', 251: 'Celebi',
    252: 'Treecko', 253: 'Grovyle', 254: 'Sceptile', 255: 'Torchic', 256: 'Combusken',
    257: 'Blaziken', 258: 'Mudkip', 259: 'Marshtomp', 260: 'Swampert', 261: 'Poochyena',
    262: 'Mightyena', 263: 'Zigzagoon', 264: 'Linoone', 265: 'Wurmple', 266: 'Silcoon',
    267: 'Beautifly', 268: 'Cascoon', 269: 'Dustox', 270: 'Lotad', 271: 'Lombre',
    272: 'Ludicolo', 273: 'Seedot', 274: 'Nuzleaf', 275: 'Shiftry', 276: 'Taillow',
    277: 'Swellow', 278: 'Wingull', 279: 'Pelipper', 280: 'Ralts', 281: 'Kirlia',
    282: 'Gardevoir', 283: 'Surskit', 284: 'Masquerain', 285: 'Shroomish', 286: 'Breloom',
    287: 'Slakoth', 288: 'Vigoroth', 289: 'Slaking', 290: 'Nincada', 291: 'Ninjask',
    292: 'Shedinja', 293: 'Whismur', 294: 'Loudred', 295: 'Exploud', 296: 'Makuhita',
    297: 'Hariyama', 298: 'Azurill', 299: 'Nosepass', 300: 'Skitty', 301: 'Delcatty',
    302: 'Sableye', 303: 'Mawile', 304: 'Aron', 305: 'Lairon', 306: 'Aggron',
    307: 'Meditite', 308: 'Medicham', 309: 'Electrike', 310: 'Manectric', 311: 'Plusle',
    312: 'Minun', 313: 'Volbeat', 314: 'Illumise', 315: 'Roselia', 316: 'Gulpin',
    317: 'Swalot', 318: 'Carvanha', 319: 'Sharpedo', 320: 'Wailmer', 321: 'Wailord',
    322: 'Numel', 323: 'Camerupt', 324: 'Torkoal', 325: 'Spoink', 326: 'Grumpig',
    327: 'Spinda', 328: 'Trapinch', 329: 'Vibrava', 330: 'Flygon', 331: 'Cacnea',
    332: 'Cacturne', 333: 'Swablu', 334: 'Altaria', 335: 'Zangoose', 336: 'Seviper',
    337: 'Lunatone', 338: 'Solrock', 339: 'Barboach', 340: 'Whiscash', 341: 'Corphish',
    342: 'Crawdaunt', 343: 'Baltoy', 344: 'Claydol', 345: 'Lileep', 346: 'Cradily',
    347: 'Anorith', 348: 'Armaldo', 349: 'Feebas', 350: 'Milotic', 351: 'Castform',
    352: 'Kecleon', 353: 'Shuppet', 354: 'Banette', 355: 'Duskull', 356: 'Dusclops',
    357: 'Tropius', 358: 'Chimecho', 359: 'Absol', 360: 'Wynaut', 361: 'Snorunt',
    362: 'Glalie', 363: 'Spheal', 364: 'Sealeo', 365: 'Walrein', 366: 'Clamperl',
    367: 'Huntail', 368: 'Gorebyss', 369: 'Relicanth', 370: 'Luvdisc', 371: 'Bagon',
    372: 'Shelgon', 373: 'Salamence', 374: 'Beldum', 375: 'Metang', 376: 'Metagross',
    377: 'Regirock', 378: 'Regice', 379: 'Registeel', 380: 'Latias', 381: 'Latios',
    382: 'Kyogre', 383: 'Groudon', 384: 'Rayquaza', 385: 'Jirachi', 386: 'Deoxys'
};

// Noms des Pokémon en français (Gen 1-3)
const pokemonNamesFR = {
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
    151: 'Mew',
    152: 'Germignon', 153: 'Macronium', 154: 'Méganium', 155: 'Héricendre', 156: 'Feurisson',
    157: 'Typhlosion', 158: 'Kaiminus', 159: 'Crocrodil', 160: 'Aligatueur', 161: 'Fouinette',
    162: 'Fouinar', 163: 'Hoothoot', 164: 'Noarfang', 165: 'Coxy', 166: 'Coxyclaque',
    167: 'Mimigal', 168: 'Migalos', 169: 'Nostenfer', 170: 'Loupio', 171: 'Lanturn',
    172: 'Pichu', 173: 'Mélo', 174: 'Toudoudou', 175: 'Togepi', 176: 'Togetic',
    177: 'Natu', 178: 'Xatu', 179: 'Wattouat', 180: 'Lainergie', 181: 'Pharamp',
    182: 'Joliflor', 183: 'Marill', 184: 'Azumarill', 185: 'Simularbre', 186: 'Tarpaud',
    187: 'Granivol', 188: 'Floravol', 189: 'Cotovol', 190: 'Capumain', 191: 'Tournegrin',
    192: 'Héliatronc', 193: 'Yanma', 194: 'Axoloto', 195: 'Maraiste', 196: 'Mentali',
    197: 'Noctali', 198: 'Cornèbre', 199: 'Roigada', 200: 'Feuforêve', 201: 'Zarbi',
    202: 'Qulbutoké', 203: 'Girafarig', 204: 'Pomdepik', 205: 'Foretress', 206: 'Insolourdo',
    207: 'Scorplane', 208: 'Steelix', 209: 'Snubbull', 210: 'Granbull', 211: 'Qwilfish',
    212: 'Cizayox', 213: 'Caratroc', 214: 'Scarhino', 215: 'Farfuret', 216: 'Teddiursa',
    217: 'Ursaring', 218: 'Limagma', 219: 'Volcaropod', 220: 'Marcacrin', 221: 'Cochignon',
    222: 'Corayon', 223: 'Rémoraid', 224: 'Octillery', 225: 'Cadoizo', 226: 'Démanta',
    227: 'Airmure', 228: 'Malosse', 229: 'Démolosse', 230: 'Hyporoi', 231: 'Phanpy',
    232: 'Donphan', 233: 'Porygon2', 234: 'Cerfrousse', 235: 'Queulorior', 236: 'Debugant',
    237: 'Kapoera', 238: 'Lippouti', 239: 'Élekid', 240: 'Magby', 241: 'Écrémeuh',
    242: 'Leuphorie', 243: 'Raikou', 244: 'Entei', 245: 'Suicune', 246: 'Embrylex',
    247: 'Ymphect', 248: 'Tyranocif', 249: 'Lugia', 250: 'Ho-Oh', 251: 'Celebi',
    252: 'Arcko', 253: 'Massko', 254: 'Jungko', 255: 'Poussifeu', 256: 'Galifeu',
    257: 'Braségali', 258: 'Gobou', 259: 'Flobio', 260: 'Laggron', 261: 'Medhyèna',
    262: 'Grahyèna', 263: 'Zigzaton', 264: 'Linéon', 265: 'Chenipotte', 266: 'Armulys',
    267: 'Charmillon', 268: 'Blindalys', 269: 'Papinox', 270: 'Nénupiot', 271: 'Lombre',
    272: 'Ludicolo', 273: 'Grainipiot', 274: 'Pifeuil', 275: 'Tengalice', 276: 'Nirondelle',
    277: 'Hélédelle', 278: 'Goélise', 279: 'Bekipan', 280: 'Tarsal', 281: 'Kirlia',
    282: 'Gardevoir', 283: 'Arakdo', 284: 'Maskadra', 285: 'Balignon', 286: 'Chapignon',
    287: 'Parecool', 288: 'Vigoroth', 289: 'Monaflèmit', 290: 'Ningale', 291: 'Ninjask',
    292: 'Munja', 293: 'Chuchmur', 294: 'Ramboum', 295: 'Brouhabam', 296: 'Makuhita',
    297: 'Hariyama', 298: 'Azurill', 299: 'Tarinor', 300: 'Skitty', 301: 'Delcatty',
    302: 'Ténéfix', 303: 'Mysdibule', 304: 'Galekid', 305: 'Galegon', 306: 'Galeking',
    307: 'Méditikka', 308: 'Charmina', 309: 'Dynavolt', 310: 'Élecsprint', 311: 'Posipi',
    312: 'Négapi', 313: 'Muciole', 314: 'Lumivole', 315: 'Rosélia', 316: 'Gloupti',
    317: 'Avaltout', 318: 'Carvanha', 319: 'Sharpedo', 320: 'Wailmer', 321: 'Wailord',
    322: 'Chamallot', 323: 'Camérupt', 324: 'Chartor', 325: 'Spoink', 326: 'Groret',
    327: 'Spinda', 328: 'Kraknoix', 329: 'Vibraninf', 330: 'Libégon', 331: 'Cacnea',
    332: 'Cacturne', 333: 'Tylton', 334: 'Altaria', 335: 'Mangriff', 336: 'Séviper',
    337: 'Séléroc', 338: 'Solaroc', 339: 'Barloche', 340: 'Barbicha', 341: 'Écrapince',
    342: 'Colhomard', 343: 'Balbuto', 344: 'Kaorine', 345: 'Lilia', 346: 'Vacilys',
    347: 'Anorith', 348: 'Armaldo', 349: 'Barpau', 350: 'Milobellus', 351: 'Morphéo',
    352: 'Kecleon', 353: 'Polichombr', 354: 'Branette', 355: 'Skelénox', 356: 'Téraclope',
    357: 'Tropius', 358: 'Éoko', 359: 'Absol', 360: 'Okéoké', 361: 'Stalgamin',
    362: 'Oniglali', 363: 'Obalie', 364: 'Phogleur', 365: 'Kaimorse', 366: 'Coquiperl',
    367: 'Serpang', 368: 'Rosabyss', 369: 'Relicanth', 370: 'Lovdisc', 371: 'Draby',
    372: 'Drackhaus', 373: 'Drattak', 374: 'Terhal', 375: 'Métang', 376: 'Métalosse',
    377: 'Regirock', 378: 'Regice', 379: 'Registeel', 380: 'Latias', 381: 'Latios',
    382: 'Kyogre', 383: 'Groudon', 384: 'Rayquaza', 385: 'Jirachi', 386: 'Deoxys'
};

const translations = {
    en: {
        btn: {
            addGame: '➕ Add Game',
            importSave: '🎮 Import ROM Save',
            save: '💾 Save',
            exportImage: '📸 Export as Image',
            exportJSON: '📤 Export JSON',
            importJSON: '📥 Import JSON',
            reset: '🔄 Reset All',
            add: '+ Add'
        },
        stats: {
            games: 'Games',
            champions: 'Champions',
            retired: 'Retired',
            dead: 'Dead'
        },
        modal: {
            selectGame: 'Select a Game',
            selectPokemon: 'Select a Pokémon',
            searchPokemon: 'Search for a Pokémon...',
            close: 'Close'
        },
        sections: {
            champions: 'Champions',
            retired: 'Retired',
            dead: 'Dead'
        },
        notifications: {
            alreadyInGame: '{name} is already in this game!',
            teamFull: 'Team full! Maximum 6 champions.',
            added: '{name} added!',
            dataSaved: 'Data saved!',
            dataExported: 'Data exported!',
            dataImported: 'Data imported!',
            dataReset: 'Data reset',
            saveError: 'Save error: {error}',
            importError: 'Import error: invalid file',
            onlyGen1: 'Only Gen 1 saves (Red/Blue/Yellow) are supported for now',
            addGameFirst: 'Add a game first before importing a save',
            invalidChoice: 'Invalid choice',
            pokemonImported: '{count} Pokémon imported from save!',
            error: 'Error: {error}'
        },
        confirms: {
            replaceData: 'Do you want to replace current data?',
            resetWarning: '⚠️ Are you sure you want to reset everything? This action is irreversible!',
            resetFinal: 'Final confirmation: all data will be lost!',
            selectGame: 'Select a game:\n{games}\n\nEnter the number:'
        }
    },
    fr: {
        btn: {
            addGame: '➕ Ajouter un jeu',
            importSave: '🎮 Importer Save ROM',
            save: '💾 Sauvegarder',
            exportImage: '📸 Exporter en Image',
            exportJSON: '📤 Exporter JSON',
            importJSON: '📥 Importer JSON',
            reset: '🔄 Réinitialiser',
            add: '+ Ajouter'
        },
        stats: {
            games: 'Jeux',
            champions: 'Champions',
            retired: 'Retraités',
            dead: 'Morts'
        },
        modal: {
            selectGame: 'Sélectionner un jeu',
            selectPokemon: 'Sélectionner un Pokémon',
            searchPokemon: 'Rechercher un Pokémon...',
            close: 'Fermer'
        },
        sections: {
            champions: 'Champions',
            retired: 'Retraités',
            dead: 'Morts'
        },
        notifications: {
            alreadyInGame: '{name} est déjà présent dans ce jeu !',
            teamFull: 'Équipe complète ! Maximum 6 champions.',
            added: '{name} ajouté !',
            dataSaved: 'Données sauvegardées !',
            dataExported: 'Données exportées !',
            dataImported: 'Données importées !',
            dataReset: 'Données réinitialisées',
            saveError: 'Erreur lors de la sauvegarde : {error}',
            importError: 'Erreur lors de l\'import : fichier invalide',
            onlyGen1: 'Seules les saves Gen 1 (Rouge/Bleu/Jaune) sont supportées pour le moment',
            addGameFirst: 'Ajoutez d\'abord un jeu avant d\'importer une save',
            invalidChoice: 'Choix invalide',
            pokemonImported: '{count} Pokémon importés depuis la save !',
            error: 'Erreur : {error}'
        },
        confirms: {
            replaceData: 'Voulez-vous remplacer les données actuelles ?',
            resetWarning: '⚠️ Êtes-vous sûr de vouloir tout réinitialiser ? Cette action est irréversible !',
            resetFinal: 'Dernière confirmation : toutes les données seront perdues !',
            selectGame: 'Sélectionnez un jeu :\n{games}\n\nEntrez le numéro :'
        }
    }
};

// Obtenir une traduction
function t(key, params = {}) {
    const keys = key.split('.');
    let value = translations[currentLang];
    
    for (const k of keys) {
        value = value?.[k];
    }
    
    if (!value) return key;
    
    // Remplacer les paramètres
    let result = value;
    for (const [param, val] of Object.entries(params)) {
        result = result.replace(`{${param}}`, val);
    }
    
    return result;
}

// Traduire le nom d'un Pokémon
function translatePokemonName(number, fallbackName) {
    if (currentLang === 'fr') {
        return pokemonNamesFR[number] || fallbackName || pokemonNamesEN[number] || `#${number}`;
    }
    return pokemonNamesEN[number] || fallbackName || `#${number}`;
}

// Appliquer les traductions
function applyTranslations() {
    // Textes
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });
    
    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = t(key);
    });
    
    // Titles
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        el.title = t(key);
    });
    
    // Re-render les jeux pour mettre à jour les sections
    if (typeof renderGames === 'function') {
        renderGames();
    }
}

// Changer de langue
function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'fr' : 'en';
    localStorage.setItem('language', currentLang);
    
    // Changer le drapeau
    document.getElementById('langIcon').textContent = currentLang === 'en' ? '🇫🇷' : '🇬🇧';
    
    applyTranslations();
}

// Charger la langue au démarrage
function loadLanguage() {
    document.getElementById('langIcon').textContent = currentLang === 'en' ? '🇫🇷' : '🇬🇧';
    applyTranslations();
}

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', loadLanguage);
