const { Schema, model } = require('mongoose');

const kingdomSchema = new Schema({
    name: { type: String, required: true, unique: true },
    owner: { type: String, required: true }, // ID Discord du propriétaire
    description: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    
    // Statistiques de base
    population: { type: Number, default: 1000 },
    gold: { type: Number, default: 1000 },
    food: { type: Number, default: 1000 },
    military: { type: Number, default: 100 },
    
    // Ressources
    resources: {
        wood: { type: Number, default: 500 },
        stone: { type: Number, default: 500 },
        iron: { type: Number, default: 200 },
        goldMines: { type: Number, default: 1 }
    },
    
    // Bâtiments
    buildings: {
        farms: { type: Number, default: 2 },
        mines: { type: Number, default: 1 },
        barracks: { type: Number, default: 1 },
        markets: { type: Number, default: 1 }
    },
    
    // Relations diplomatiques
    alliances: [{ type: String }], // IDs des royaumes alliés
    enemies: [{ type: String }],   // IDs des royaumes ennemis
    
    // Territoire
    territory: {
        size: { type: Number, default: 1 }, // en km²
        climate: { type: String, default: 'tempéré' },
        fertility: { type: Number, default: 50 } // 0-100
    }
});

module.exports = model('Kingdom', kingdomSchema); 