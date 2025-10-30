/**
 * Module pour communiquer avec le backend API
 */

const BackendAPI = {
        // Décommentez la ligne qui correspond à votre environnement
    // baseURL: 'http://localhost:3000/api', // Pour le développement local
    baseURL: 'https://VOTRE_URL_RENDER.onrender.com/api', // Pour la production
    
    /**
     * Vérifie si le backend est disponible
     */
    async checkHealth() {
        try {
            const response = await fetch(`${this.baseURL}/health`);
            return response.ok;
        } catch (error) {
            console.error('❌ Backend non disponible:', error);
            return false;
        }
    },
    
    /**
     * Parse une save via le backend
     * @param {File} file - Fichier .sav
     * @returns {Promise<Object>} Données parsées
     */
    async parseSave(file) {
        const formData = new FormData();
        formData.append('saveFile', file);
        
        try {
            const response = await fetch(`${this.baseURL}/parse-save`, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to parse save');
            }
            
            const data = await response.json();
            console.log('✅ Save parsée par le backend:', data);
            return this.convertToAppFormat(data);
        } catch (error) {
            console.error('❌ Erreur backend:', error);
            throw error;
        }
    },
    
    /**
     * Convertit le format PKHeX vers le format de l'app
     */
    convertToAppFormat(pkhexData) {
        return {
            saveInfo: {
                generation: pkhexData.generation,
                game: pkhexData.game,
                size: 0 // Non disponible depuis PKHeX
            },
            player: {
                name: pkhexData.trainer.name,
                id: pkhexData.trainer.id,
                gender: pkhexData.trainer.gender,
                playTime: pkhexData.trainer.playTime
            },
            partyCount: pkhexData.party.length,
            team: pkhexData.party.map(pk => ({
                number: pk.speciesId,
                name: pk.species,
                nickname: pk.nickname,
                level: pk.level,
                exp: pk.exp,
                nature: pk.nature,
                ability: pk.ability,
                gender: pk.gender,
                shiny: pk.isShiny,
                hp: pk.hp.current,
                maxHp: pk.hp.max,
                attack: pk.stats.attack,
                defense: pk.stats.defense,
                speed: pk.stats.speed,
                spAttack: pk.stats.spAttack,
                spDefense: pk.stats.spDefense,
                ivs: pk.ivs,
                evs: pk.evs,
                moves: pk.moves,
                heldItem: pk.heldItem,
                status: pk.status
            })),
            pokedex: pkhexData.pokedex
        };
    }
};

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BackendAPI;
}

console.log('✅ Backend API module chargé');
