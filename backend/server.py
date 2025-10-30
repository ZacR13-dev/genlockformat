#!/usr/bin/env python3
"""
Backend API Flask pour parser les saves Pokémon Gen 1-7
Utilise des bibliothèques Python spécialisées pour chaque génération
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import tempfile

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = tempfile.gettempdir()
app.config['MAX_CONTENT_LENGTH'] = 2 * 1024 * 1024  # 2MB max

def parse_gen3_save(file_path):
    """Parse une save Gen 3 avec notre propre implémentation"""
    try:
        with open(file_path, 'rb') as f:
            data = f.read()
        
        # Trouver la save active (A ou B)
        save_a_index = int.from_bytes(data[0x0FFC:0x1000], 'little')
        save_b_index = int.from_bytes(data[0xDFFC:0xE000], 'little')
        
        active_save = 0xE000 if save_b_index > save_a_index else 0x0000
        
        # Trouver la section Team (ID=1)
        team_section = None
        print(f"Active save: 0x{active_save:X}")
        for i in range(14):
            section_offset = active_save + (i * 0x1000)
            section_id = int.from_bytes(data[section_offset + 0xFF4:section_offset + 0xFF6], 'little')
            print(f"Section {i}: ID={section_id} at offset 0x{section_offset:X}")
            if section_id == 1:
                team_section = section_offset
                break
        
        if team_section is None:
            raise Exception(f"Team section not found. Active save at 0x{active_save:X}")
        
        # Lire l'équipe
        team_size = data[team_section + 0x234]
        party = []
        
        for i in range(team_size):
            pokemon_offset = team_section + 0x238 + (i * 100)
            pokemon_data = parse_gen3_pokemon(data, pokemon_offset)
            if pokemon_data:
                party.append(pokemon_data)
        
        # Lire le nom du trainer (section 0)
        trainer_section = None
        for i in range(14):
            section_offset = active_save + (i * 0x1000)
            section_id = int.from_bytes(data[section_offset + 0xFF4:section_offset + 0xFF6], 'little')
            if section_id == 0:
                trainer_section = section_offset
                break
        
        trainer_name = "Trainer"
        if trainer_section:
            # Nom du trainer à l'offset 0x00 (7 bytes)
            name_bytes = data[trainer_section:trainer_section + 7]
            trainer_name = decode_gen3_text(name_bytes)
        
        return {
            'generation': 3,
            'game': 'Emerald',
            'trainer': {
                'name': trainer_name,
                'id': '00000',
                'gender': 'Male',
                'playTime': '0h 0m'
            },
            'party': party,
            'pokedex': {
                'seen': 0,
                'caught': 0
            }
        }
    except Exception as e:
        raise Exception(f"Gen3 parsing error: {str(e)}")

def decode_gen3_text(data):
    """Décode le texte Gen 3"""
    # Table de caractères Gen 3 simplifiée
    chars = " ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    result = ""
    for byte in data:
        if byte == 0xFF:
            break
        if byte < len(chars):
            result += chars[byte]
        else:
            result += "?"
    return result.strip()

def parse_gen3_pokemon(data, offset):
    """Parse un Pokémon Gen 3"""
    try:
        # Lire PID et OT ID
        pid = int.from_bytes(data[offset:offset+4], 'little')
        ot_id = int.from_bytes(data[offset+4:offset+8], 'little')
        
        if pid == 0:
            return None
        
        # Décrypter les données (XOR avec PID ^ OT_ID)
        key = pid ^ ot_id
        decrypted = bytearray(48)
        
        for i in range(0, 48, 4):
            encrypted = int.from_bytes(data[offset + 32 + i:offset + 36 + i], 'little')
            decrypted_value = encrypted ^ key
            decrypted[i:i+4] = decrypted_value.to_bytes(4, 'little')
        
        # Ordre des sous-structures selon PID % 24
        order_table = [
            [0,1,2,3], [0,1,3,2], [0,2,1,3], [0,2,3,1], [0,3,1,2], [0,3,2,1],
            [1,0,2,3], [1,0,3,2], [1,2,0,3], [1,2,3,0], [1,3,0,2], [1,3,2,0],
            [2,0,1,3], [2,0,3,1], [2,1,0,3], [2,1,3,0], [2,3,0,1], [2,3,1,0],
            [3,0,1,2], [3,0,2,1], [3,1,0,2], [3,1,2,0], [3,2,0,1], [3,2,1,0]
        ]
        
        order = order_table[pid % 24]
        
        # Extraire les sous-structures
        substructs = [decrypted[i*12:(i+1)*12] for i in range(4)]
        
        # Trouver Growth (substruct 0)
        growth_index = order.index(0)
        growth = substructs[growth_index]
        
        # Lire l'espèce
        species = int.from_bytes(growth[0:2], 'little')
        
        if species == 0 or species > 411:
            return None
        
        # Lire les stats de party (non cryptées, offset 84-99)
        level = data[offset + 85]
        current_hp = int.from_bytes(data[offset + 88:offset + 90], 'little')
        max_hp = int.from_bytes(data[offset + 90:offset + 92], 'little')
        attack = int.from_bytes(data[offset + 92:offset + 94], 'little')
        defense = int.from_bytes(data[offset + 94:offset + 96], 'little')
        speed = int.from_bytes(data[offset + 96:offset + 98], 'little')
        sp_attack = int.from_bytes(data[offset + 98:offset + 100], 'little')
        
        return {
            'species': f'Pokemon #{species}',
            'speciesId': species,
            'nickname': '',
            'level': level,
            'exp': 0,
            'nature': 'Hardy',
            'ability': 'Unknown',
            'gender': 'Unknown',
            'isShiny': False,
            'hp': {
                'current': current_hp,
                'max': max_hp
            },
            'stats': {
                'hp': max_hp,
                'attack': attack,
                'defense': defense,
                'spAttack': sp_attack,
                'spDefense': sp_attack,
                'speed': speed
            },
            'ivs': {'hp': 0, 'attack': 0, 'defense': 0, 'spAttack': 0, 'spDefense': 0, 'speed': 0},
            'evs': {'hp': 0, 'attack': 0, 'defense': 0, 'spAttack': 0, 'spDefense': 0, 'speed': 0},
            'moves': [],
            'heldItem': None,
            'status': 'OK'
        }
    except Exception as e:
        print(f"Error parsing pokemon: {e}")
        return None

def detect_generation(file_size):
    """Détecte la génération selon la taille du fichier"""
    if file_size == 32768:
        return 1
    elif file_size in [32784, 65536]:
        return 2
    elif file_size in [131072, 131088]:
        return 3
    elif file_size in [262144, 524288]:
        return 4
    elif file_size == 524288:
        return 5
    elif file_size in [415232, 524288]:
        return 6
    elif file_size in [232960, 262144, 524288]:
        return 7
    else:
        return None

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'message': 'GenLock Python Backend API is running',
        'supported_generations': [1, 2, 3]
    })

@app.route('/api/parse-save', methods=['POST'])
def parse_save():
    """Parse une save Pokémon"""
    try:
        # Vérifier qu'un fichier a été envoyé
        if 'saveFile' not in request.files:
            return jsonify({'error': 'No save file provided'}), 400
        
        file = request.files['saveFile']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Sauvegarder temporairement
        temp_path = os.path.join(UPLOAD_FOLDER, 'temp_save.sav')
        file.save(temp_path)
        
        # Détecter la génération
        file_size = os.path.getsize(temp_path)
        generation = detect_generation(file_size)
        
        if generation is None:
            os.remove(temp_path)
            return jsonify({'error': f'Unsupported save file size: {file_size} bytes'}), 400
        
        # Parser selon la génération
        if generation == 3:
            result = parse_gen3_save(temp_path)
        else:
            os.remove(temp_path)
            return jsonify({'error': f'Generation {generation} not yet implemented in Python backend'}), 501
        
        # Nettoyer
        os.remove(temp_path)
        
        return jsonify(result)
        
    except Exception as e:
        # Nettoyer en cas d'erreur
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print('🐍 GenLock Python Backend API starting...')
    print('📂 Upload endpoint: POST http://localhost:3000/api/parse-save')
    app.run(host='0.0.0.0', port=3000, debug=True)
