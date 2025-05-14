const fs = require('fs').promises;
const path = require('path');
const { createKingdomStructure } = require('../models/kingdomStructure');

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
        // Fusion deep des objets
        data.kingdoms[index] = deepMerge(data.kingdoms[index], updateData);
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
        population: k.population.total,
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