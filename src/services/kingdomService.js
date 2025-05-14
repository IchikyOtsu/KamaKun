const fs = require('fs').promises;
const path = require('path');
const { createKingdomStructure, TYPES_POLITIQUE } = require('../models/kingdomStructure');

const DATA_FILE = path.join(__dirname, '../data/kingdoms.json');

// Fonction pour lire les données
async function readData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        const parsedData = JSON.parse(data);
        // S'assurer que la structure est correcte
        if (!parsedData || !Array.isArray(parsedData.kingdoms)) {
            return { kingdoms: [] };
        }
        return parsedData;
    } catch (error) {
        // Si le fichier n'existe pas ou est vide, créer la structure par défaut
        const defaultData = { kingdoms: [] };
        await writeData(defaultData);
        return defaultData;
    }
}

// Fonction pour écrire les données
async function writeData(data) {
    // S'assurer que le dossier existe
    const dir = path.dirname(DATA_FILE);
    try {
        await fs.access(dir);
    } catch {
        await fs.mkdir(dir, { recursive: true });
    }
    // S'assurer que la structure est correcte avant d'écrire
    const dataToWrite = {
        kingdoms: Array.isArray(data.kingdoms) ? data.kingdoms : []
    };
    await fs.writeFile(DATA_FILE, JSON.stringify(dataToWrite, null, 2), 'utf8');
}

// Créer un nouveau royaume
async function createKingdom(kingdomData) {
    const data = await readData();
    
    // Utiliser notre générateur de structure de royaume
    const newKingdom = createKingdomStructure({
        id: Date.now().toString(),
        name: kingdomData.name,
        description: kingdomData.description,
        owner: kingdomData.owner,
        politique: kingdomData.politique || 'monarchie', // La politique par défaut est monarchie
        statsModificateurs: kingdomData.statsModificateurs || {
            stabilité: 0,
            foi: 0,
            soutien_guerre: 0
        },
        // Éventuelles valeurs spécifiques pour les stats en points
        stats: {
            prestige: kingdomData.prestige,
            influence: kingdomData.influence,
            prospérité: kingdomData.prospérité,
            recherche: kingdomData.recherche
        }
    });
    
    data.kingdoms.push(newKingdom);
    await writeData(data);
    return newKingdom;
}

// Trouver un royaume par ID
async function findKingdomById(id) {
    const data = await readData();
    return data.kingdoms.find(k => k.id === id);
}

// Trouver un royaume par propriétaire
async function findKingdomByOwner(ownerId) {
    const data = await readData();
    return data.kingdoms.find(k => k.owner === ownerId);
}

// Trouver un royaume par nom
async function findKingdomByName(name) {
    const data = await readData();
    return data.kingdoms.find(k => k.name === name);
}

// Mettre à jour un royaume
async function updateKingdom(id, updateData) {
    const data = await readData();
    const index = data.kingdoms.findIndex(k => k.id === id);
    
    if (index !== -1) {
        const kingdom = data.kingdoms[index];
        
        // Si on change le type de politique, recalculer les stats
        if (updateData.politique && updateData.politique !== kingdom.politique) {
            // Mémoriser les modificateurs actuels des stats en pourcentage
            const currentMods = {
                stabilité: kingdom.statsModificateurs.stabilité,
                foi: kingdom.statsModificateurs.foi,
                soutien_guerre: kingdom.statsModificateurs.soutien_guerre
            };
            
            // Mémoriser les valeurs actuelles des stats en points
            const currentStats = {
                prestige: kingdom.stats.prestige,
                influence: kingdom.stats.influence,
                prospérité: kingdom.stats.prospérité,
                recherche: kingdom.stats.recherche
            };
            
            // Créer un nouveau royaume temporaire avec la nouvelle politique
            const tempKingdom = createKingdomStructure({
                ...kingdom,
                politique: updateData.politique,
                statsModificateurs: currentMods,
                stats: currentStats
            });
            
            // Mettre à jour les données avec le nouveau royaume
            data.kingdoms[index] = tempKingdom;
        } else {
            // Si on modifie directement les stats en pourcentage
            if (updateData.stats) {
                // Pour les stats en pourcentage, mettre à jour les modificateurs
                const mods = { ...kingdom.statsModificateurs };
                
                ['stabilité', 'foi', 'soutien_guerre'].forEach(stat => {
                    if (updateData.stats[stat] !== undefined) {
                        // Calculer le nouveau modificateur
                        mods[stat] = updateData.stats[stat] - kingdom.statsBase[stat];
                        
                        // S'assurer que la stat finale est entre 0 et 100
                        const statFinale = Math.max(0, Math.min(100, kingdom.statsBase[stat] + mods[stat]));
                        
                        // Ajuster le modificateur si nécessaire
                        if (statFinale !== kingdom.statsBase[stat] + mods[stat]) {
                            mods[stat] = statFinale - kingdom.statsBase[stat];
                        }
                        
                        // Mettre à jour la stat finale
                        updateData.stats[stat] = statFinale;
                    }
                });
                
                // Mettre à jour les modificateurs
                updateData.statsModificateurs = mods;
            }
            
            // Fusion deep des objets
            data.kingdoms[index] = deepMerge(data.kingdoms[index], updateData);
        }
        
        await writeData(data);
        return data.kingdoms[index];
    }
    return null;
}

// Supprimer un royaume
async function deleteKingdom(id) {
    const data = await readData();
    const index = data.kingdoms.findIndex(k => k.id === id);
    if (index !== -1) {
        const deleted = data.kingdoms.splice(index, 1)[0];
        await writeData(data);
        return deleted;
    }
    return null;
}

// Lister tous les royaumes
async function listKingdoms() {
    const data = await readData();
    return data.kingdoms;
}

// Lister les royaumes avec informations résumées
async function listKingdomsSummary() {
    const data = await readData();
    return data.kingdoms.map(k => ({
        id: k.id,
        name: k.name,
        owner: k.owner,
        politique: k.politique,
        population: k.population.total,
        territoire: k.territoire.taille_totale,
        createdAt: k.createdAt
    }));
}

// Fonction utilitaire pour fusionner deux objets en profondeur
function deepMerge(target, source) {
    // Si source n'est pas un objet ou est null, on retourne simplement source
    if (typeof source !== 'object' || source === null) {
        return source;
    }
    
    // Copie de la cible
    const output = Object.assign({}, target);
    
    // Parcourir les propriétés de source
    Object.keys(source).forEach(key => {
        if (source[key] === undefined) return; // Ignorer les valeurs undefined
        
        // Si la propriété existe dans la cible et est un objet, fusionner récursivement
        if (typeof output[key] === 'object' && output[key] !== null && 
            typeof source[key] === 'object' && source[key] !== null) {
            output[key] = deepMerge(output[key], source[key]);
        } else {
            // Sinon, copier la valeur de source
            output[key] = source[key];
        }
    });
    
    return output;
}

module.exports = {
    createKingdom,
    findKingdomById,
    findKingdomByOwner,
    findKingdomByName,
    updateKingdom,
    deleteKingdom,
    listKingdoms,
    listKingdomsSummary
}; 