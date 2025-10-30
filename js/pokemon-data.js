/* ============================================
   POKEMON DATA - Dictionnaire des Pokémon
   Base de données complète Gen 1 à Gen 7 (807 Pokémon)
   ============================================ */

// ✅ SOLUTION 1: Centraliser dans un objet unique avec métadonnées
const PokemonData = {
    // Métadonnées
    version: '1.0.0',
    lastUpdate: '2025-10-30',
    totalPokemon: 807,
    
    // Noms par langue (extensible)
    names: {
        fr: {}, // Rempli ci-dessous
        en: {}  // À ajouter progressivement
    },
    
    // Métadonnées par Pokémon
    meta: {
        // Exemple: 25: { gen: 1, types: ['Électrik'] }
    }
};

// Dictionnaire des Pokémon Gen 1 (numéro -> nom français)
const pokemonGen1 = {
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
    // Gen 2
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
    // Gen 3
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
    382: 'Kyogre', 383: 'Groudon', 384: 'Rayquaza', 385: 'Jirachi', 386: 'Deoxys',
    // Gen 4
    387: 'Tortipouss', 388: 'Boskara', 389: 'Torterra', 390: 'Ouisticram', 391: 'Chimpenfeu',
    392: 'Simiabraz', 393: 'Tiplouf', 394: 'Prinplouf', 395: 'Pingoléon', 396: 'Étourmi',
    397: 'Étourvol', 398: 'Étouraptor', 399: 'Keunotor', 400: 'Castorno', 401: 'Crikzik',
    402: 'Mélokrik', 403: 'Lixy', 404: 'Luxio', 405: 'Luxray', 406: 'Rozbouton',
    407: 'Roserade', 408: 'Kranidos', 409: 'Charkos', 410: 'Dinoclier', 411: 'Bastiodon',
    412: 'Cheniti', 413: 'Cheniselle', 414: 'Papilord', 415: 'Apitrini', 416: 'Apireine',
    417: 'Pachirisu', 418: 'Mustébouée', 419: 'Mustéflott', 420: 'Ceribou', 421: 'Ceriflor',
    422: 'Sancoki', 423: 'Tritosor', 424: 'Capidextre', 425: 'Baudrive', 426: 'Grodrive',
    427: 'Laporeille', 428: 'Lockpin', 429: 'Magirêve', 430: 'Corboss', 431: 'Chaglam',
    432: 'Chaffreux', 433: 'Korillon', 434: 'Moufouette', 435: 'Moufflair', 436: 'Archéomire',
    437: 'Archéodong', 438: 'Manzaï', 439: 'Mime Jr.', 440: 'Ptiravi', 441: 'Pijako',
    442: 'Spiritomb', 443: 'Griknot', 444: 'Carmache', 445: 'Carchacrok', 446: 'Goinfrex',
    447: 'Riolu', 448: 'Lucario', 449: 'Hippopotas', 450: 'Hippodocus', 451: 'Rapion',
    452: 'Drascore', 453: 'Cradopaud', 454: 'Coatox', 455: 'Vortente', 456: 'Écayon',
    457: 'Luminéon', 458: 'Babimanta', 459: 'Blizzi', 460: 'Blizzaroi', 461: 'Dimoret',
    462: 'Magnézone', 463: 'Coudlangue', 464: 'Rhinastoc', 465: 'Bouldeneu', 466: 'Élekable',
    467: 'Maganon', 468: 'Togekiss', 469: 'Yanméga', 470: 'Phyllali', 471: 'Givrali',
    472: 'Scorvol', 473: 'Mammochon', 474: 'Porygon-Z', 475: 'Gallame', 476: 'Tarinorme',
    477: 'Noctunoir', 478: 'Momartik', 479: 'Motisma', 480: 'Créhelf', 481: 'Créfollet',
    482: 'Créfadet', 483: 'Dialga', 484: 'Palkia', 485: 'Heatran', 486: 'Regigigas',
    487: 'Giratina', 488: 'Cresselia', 489: 'Phione', 490: 'Manaphy', 491: 'Darkrai',
    492: 'Shaymin', 493: 'Arceus',
    // Gen 5
    494: 'Victini', 495: 'Vipélierre', 496: 'Lianaja', 497: 'Majaspic', 498: 'Gruikui',
    499: 'Grotichon', 500: 'Roitiflam', 501: 'Moustillon', 502: 'Mateloutre', 503: 'Clamiral',
    504: 'Ratentif', 505: 'Miradar', 506: 'Ponchiot', 507: 'Ponchien', 508: 'Mastouffe',
    509: 'Chacripan', 510: 'Léopardus', 511: 'Feuillajou', 512: 'Feuiloutan', 513: 'Flamajou',
    514: 'Flamoutan', 515: 'Flotajou', 516: 'Flotoutan', 517: 'Munna', 518: 'Mushana',
    519: 'Poichigeon', 520: 'Colombeau', 521: 'Déflaisan', 522: 'Zébibron', 523: 'Zéblitz',
    524: 'Nodulithe', 525: 'Géolithe', 526: 'Gigalithe', 527: 'Chovsourir', 528: 'Rhinolove',
    529: 'Rototaupe', 530: 'Minotaupe', 531: 'Nanméouïe', 532: 'Charpenti', 533: 'Ouvrifier',
    534: 'Bétochef', 535: 'Tritonde', 536: 'Batracné', 537: 'Crapustule', 538: 'Judokrak',
    539: 'Karaclée', 540: 'Larveyette', 541: 'Couverdure', 542: 'Manternel', 543: 'Venipatte',
    544: 'Scobolide', 545: 'Brutapode', 546: 'Doudouvet', 547: 'Farfaduvet', 548: 'Chlorobule',
    549: 'Fragilady', 550: 'Bargantua', 551: 'Mascaïman', 552: 'Escroco', 553: 'Crocorible',
    554: 'Darumarond', 555: 'Darumacho', 556: 'Maracachi', 557: 'Crabicoque', 558: 'Crabaraque',
    559: 'Baggiguane', 560: 'Baggaïd', 561: 'Cryptéro', 562: 'Tutafeh', 563: 'Tutankafer',
    564: 'Carapagos', 565: 'Mégapagos', 566: 'Arkéapti', 567: 'Aéroptéryx', 568: 'Miamiasme',
    569: 'Miasmax', 570: 'Zorua', 571: 'Zoroark', 572: 'Chinchidou', 573: 'Pashmilla',
    574: 'Scrutella', 575: 'Mesmérella', 576: 'Sidérella', 577: 'Nucléos', 578: 'Méios',
    579: 'Symbios', 580: 'Couaneton', 581: 'Lakmécygne', 582: 'Sorbébé', 583: 'Sorboul',
    584: 'Sorbouboul', 585: 'Vivaldaim', 586: 'Haydaim', 587: 'Emolga', 588: 'Carabing',
    589: 'Lançargot', 590: 'Trompignon', 591: 'Gaulet', 592: 'Viskuse', 593: 'Moyade',
    594: 'Mamanbo', 595: 'Statitik', 596: 'Mygavolt', 597: 'Grindur', 598: 'Noacier',
    599: 'Tic', 600: 'Clic', 601: 'Cliticlic', 602: 'Anchwatt', 603: 'Lampéroie',
    604: 'Ohmassacre', 605: 'Lewsor', 606: 'Neitram', 607: 'Funécire', 608: 'Mélancolux',
    609: 'Lugulabre', 610: 'Coupenotte', 611: 'Incisache', 612: 'Tranchodon', 613: 'Polarhume',
    614: 'Polagriffe', 615: 'Hexagel', 616: 'Escargaume', 617: 'Limaspeed', 618: 'Limonde',
    619: 'Kungfouine', 620: 'Shaofouine', 621: 'Drakkarmin', 622: 'Gringolem', 623: 'Golemastoc',
    624: 'Scalpion', 625: 'Scalproie', 626: 'Frison', 627: 'Furaiglon', 628: 'Gueriaigle',
    629: 'Vostourno', 630: 'Vaututrice', 631: 'Aflamanoir', 632: 'Fermite', 633: 'Solochi',
    634: 'Diamat', 635: 'Trioxhydre', 636: 'Pyronille', 637: 'Pyrax', 638: 'Cobaltium',
    639: 'Terrakium', 640: 'Viridium', 641: 'Boréas', 642: 'Fulguris', 643: 'Reshiram',
    644: 'Zekrom', 645: 'Démétéros', 646: 'Kyurem', 647: 'Keldeo', 648: 'Meloetta',
    649: 'Genesect',
    // Gen 6
    650: 'Marisson', 651: 'Boguérisse', 652: 'Blindépique', 653: 'Feunnec', 654: 'Roussil',
    655: 'Goupelin', 656: 'Grenousse', 657: 'Croâporal', 658: 'Amphinobi', 659: 'Sapereau',
    660: 'Excavarenne', 661: 'Passerouge', 662: 'Braisillon', 663: 'Flambusard', 664: 'Lépidonille',
    665: 'Pérégrain', 666: 'Prismillon', 667: 'Hélionceau', 668: 'Némélios', 669: 'Flabébé',
    670: 'Floette', 671: 'Florges', 672: 'Cabriolaine', 673: 'Chevroum', 674: 'Pandespiègle',
    675: 'Pandarbare', 676: 'Couafarel', 677: 'Psystigri', 678: 'Mistigrix', 679: 'Monorpale',
    680: 'Dimoclès', 681: 'Exagide', 682: 'Fluvetin', 683: 'Cocotine', 684: 'Sucroquin',
    685: 'Cupcanaille', 686: 'Sepiatop', 687: 'Sepiatroce', 688: 'Opermine', 689: 'Golgopathe',
    690: 'Venalgue', 691: 'Kravarech', 692: 'Flingouste', 693: 'Gamblast', 694: 'Galvaran',
    695: 'Iguolta', 696: 'Ptyranidur', 697: 'Rexillius', 698: 'Amagara', 699: 'Dragmara',
    700: 'Nymphali', 701: 'Brutalibré', 702: 'Dedenne', 703: 'Strassie', 704: 'Colimucus',
    705: 'Muplodocus', 706: 'Mucuscule', 707: 'Trousselin', 708: 'Brocélôme', 709: 'Desséliande',
    710: 'Pitrouille', 711: 'Banshitrouye', 712: 'Grelaçon', 713: 'Séracrawl', 714: 'Sonistrelle',
    715: 'Bruyverne', 716: 'Xerneas', 717: 'Yveltal', 718: 'Zygarde', 719: 'Diancie',
    720: 'Hoopa', 721: 'Volcanion',
    // Gen 7
    722: 'Brindibou', 723: 'Efflèche', 724: 'Archéduc', 725: 'Flamiaou', 726: 'Matoufeu',
    727: 'Félinferno', 728: 'Otaquin', 729: 'Otarlette', 730: 'Oratoria', 731: 'Picassaut',
    732: 'Piclairon', 733: 'Bazoucan', 734: 'Manglouton', 735: 'Argouste', 736: 'Larvibule',
    737: 'Chrysapile', 738: 'Lucanon', 739: 'Crabagarre', 740: 'Crabominable', 741: 'Plumeline',
    742: 'Bombydou', 743: 'Rubombelle', 744: 'Rocabot', 745: 'Lougaroc', 746: 'Froussardine',
    747: 'Vorastérie', 748: 'Prédastérie', 749: 'Tiboudet', 750: 'Bourrinos', 751: 'Araqua',
    752: 'Tarenbulle', 753: 'Mimantis', 754: 'Floramantis', 755: 'Spododo', 756: 'Lampignon',
    757: 'Tritox', 758: 'Malamandre', 759: 'Nounourson', 760: 'Chelours', 761: 'Croquine',
    762: 'Candine', 763: 'Sucreine', 764: 'Guérilande', 765: 'Gouroutan', 766: 'Quartermac',
    767: 'Sovkipou', 768: 'Sarmuraï', 769: 'Bacabouh', 770: 'Trépassable', 771: 'Concombaffe',
    772: 'Type:0', 773: 'Silvallié', 774: 'Météno', 775: 'Dodoala', 776: 'Boumata',
    777: 'Togedemaru', 778: 'Mimiqui', 779: 'Denticrisse', 780: 'Draïeul', 781: 'Sinistrail',
    782: 'Écaïd', 783: 'Ékaïser', 784: 'Tokorico', 785: 'Tokopiyon', 786: 'Tokotoro',
    787: 'Tokopisco', 788: 'Cosmog', 789: 'Cosmovum', 790: 'Solgaleo', 791: 'Lunala',
    792: 'Zéroïd', 793: 'Mouscoto', 794: 'Cancrelove', 795: 'Câblifère', 796: 'Bamboiselle',
    797: 'Katagami', 798: 'Engloutyran', 799: 'Necrozma', 800: 'Magearna', 801: 'Marshadow',
    802: 'Zeraora', 803: 'Vémini', 804: 'Mandrillon', 805: 'Ama-Ama', 806: 'Pierroteknik',
    807: 'Banane'
};

// ✅ SOLUTION 2: Utiliser directement pokemonGen1 qui contient toutes les générations
// (Le nom est trompeur mais l'objet contient Gen 1-7)
PokemonData.names.fr = pokemonGen1;

// ✅ SOLUTION 3: API unifiée pour accéder aux données
PokemonData.getName = function(id, lang = 'fr') {
    return this.names[lang]?.[id] || `Pokémon #${id}`;
};

PokemonData.getByGen = function(gen) {
    const ranges = {
        1: [1, 151],
        2: [152, 251],
        3: [252, 386],
        4: [387, 493],
        5: [494, 649],
        6: [650, 721],
        7: [722, 807]
    };
    const [start, end] = ranges[gen] || [0, 0];
    const result = [];
    for (let i = start; i <= end; i++) {
        if (this.names.fr[i]) {
            result.push({ id: i, name: this.names.fr[i] });
        }
    }
    return result;
};

PokemonData.search = function(query, lang = 'fr') {
    query = query.toLowerCase();
    return Object.entries(this.names[lang])
        .filter(([id, name]) => name.toLowerCase().includes(query))
        .map(([id, name]) => ({ id: parseInt(id), name }));
};

// ✅ SOLUTION 4: Compatibilité avec l'ancien code
// Garder les variables globales pour ne pas casser le code existant
// IMPORTANT: Définir APRÈS avoir rempli PokemonData.names.fr
let pokemonNames = PokemonData.names.fr;

// Export pour utilisation dans d'autres modules
if (typeof window !== 'undefined') {
    window.PokemonData = PokemonData;
    window.pokemonNames = pokemonNames;
}

// Log pour debug
console.log('✅ PokemonData chargé:', Object.keys(PokemonData.names.fr).length, 'Pokémon');
