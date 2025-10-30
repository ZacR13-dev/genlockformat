// Export en image - Version grille simple
function exportAsImage() {
    if (gamesData.length === 0) {
        showNotification('⚠️ Ajoutez au moins un jeu avant d\'exporter !', 'warning');
        return;
    }
    
    showNotification('📸 Génération de l\'image...', 'success');
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Dimensions
    const cellWidth = 180;
    const cellHeight = 60;
    const headerHeight = 150;
    const labelWidth = 150;
    const padding = 30;
    const spriteSize = 48;
    
    const numGames = gamesData.length;
    const maxPokemon = Math.max(6, ...gamesData.map(g => Math.max(g.champions.length, g.retired.length, g.dead.length)));
    
    const width = labelWidth + (numGames * cellWidth) + (padding * 2);
    const height = padding + 60 + headerHeight + (3 * (maxPokemon * cellHeight + 40)) + padding;
    
    canvas.width = width;
    canvas.height = height;
    
    // Fond blanc
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    
    // Titre
    ctx.fillStyle = '#24292f';
    ctx.font = 'bold 36px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎮 GenLock Tracker', width / 2, padding + 40);
    
    let yPos = padding + 80;
    
    // Headers des jeux
    gamesData.forEach((game, gameIndex) => {
        const x = padding + labelWidth + (gameIndex * cellWidth);
        
        // Bordure
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, yPos, cellWidth, headerHeight);
        
        // Nom du jeu
        ctx.fillStyle = '#24292f';
        ctx.font = 'bold 16px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        const lines = game.name.split(' ');
        lines.forEach((line, i) => {
            ctx.fillText(line, x + cellWidth / 2, yPos + 30 + (i * 20));
        });
        
        // Gen info
        ctx.font = '12px -apple-system, sans-serif';
        ctx.fillStyle = '#666';
        ctx.fillText(`Gen ${game.gen}`, x + cellWidth / 2, yPos + headerHeight - 20);
    });
    
    yPos += headerHeight;
    
    // Sections
    const sections = [
        { name: 'Champions', key: 'champions', color: '#2ea44f', bg: '#d4f4dd' },
        { name: 'Retired', key: 'retired', color: '#0969da', bg: '#ddf4ff' },
        { name: 'Dead', key: 'dead', color: '#cf222e', bg: '#ffebe9' }
    ];
    
    sections.forEach((section) => {
        const sectionY = yPos;
        
        // Label de section (vertical)
        ctx.save();
        ctx.translate(padding + labelWidth / 2, sectionY + (maxPokemon * cellHeight + 40) / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = section.color;
        ctx.font = 'bold 24px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(section.name, 0, 0);
        ctx.restore();
        
        // Bordure du label
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(padding, sectionY, labelWidth, maxPokemon * cellHeight + 40);
        
        // Fond coloré
        ctx.fillStyle = section.bg;
        ctx.fillRect(padding + labelWidth, sectionY, numGames * cellWidth, maxPokemon * cellHeight + 40);
        
        // Cellules pour chaque jeu
        gamesData.forEach((game, gameIndex) => {
            const x = padding + labelWidth + (gameIndex * cellWidth);
            const pokemons = game[section.key] || [];
            
            // Bordure de la cellule
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, sectionY, cellWidth, maxPokemon * cellHeight + 40);
            
            // Pokémon
            pokemons.slice(0, maxPokemon).forEach((pokemon, pokemonIndex) => {
                const pokemonY = sectionY + 20 + (pokemonIndex * cellHeight);
                
                // Nom du Pokémon
                ctx.fillStyle = section.key === 'dead' ? '#666' : '#24292f';
                ctx.font = 'bold 14px -apple-system, sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText(pokemon.name, x + 10, pokemonY + 30);
                
                // Ligne barrée pour les morts
                if (section.key === 'dead') {
                    ctx.strokeStyle = section.color;
                    ctx.lineWidth = 2;
                    const textWidth = ctx.measureText(pokemon.name).width;
                    ctx.beginPath();
                    ctx.moveTo(x + 10, pokemonY + 25);
                    ctx.lineTo(x + 10 + textWidth, pokemonY + 25);
                    ctx.stroke();
                }
            });
        });
        
        yPos += maxPokemon * cellHeight + 40;
    });
    
    // Footer
    ctx.fillStyle = '#666';
    ctx.font = '14px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Généré avec GenLock Tracker • ${new Date().toLocaleDateString('fr-FR')}`, width / 2, height - 20);
    
    // Télécharger
    canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `genlock-${new Date().toISOString().split('T')[0]}.png`;
        link.click();
        URL.revokeObjectURL(url);
        showNotification('✅ Image exportée !', 'success');
    });
}
