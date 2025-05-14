// Structure simplifiée d'un royaume pour RP géopolitique
const path = require('path');
const fs = require('fs');

// Charger les données des politiques depuis le fichier JSON
const politiquesPath = path.join(__dirname, '../data/politiques.json');
let POLITIQUES = {};
try {
    const politiquesRaw = fs.readFileSync(politiquesPath, 'utf8');
    const politiquesData = JSON.parse(politiquesRaw);
    POLITIQUES = politiquesData.politiques;
} catch (error) {
    console.error('Erreur lors du chargement des politiques:', error);
    // Valeurs par défaut au cas où
    POLITIQUES = {
        monarchie: { stabilité: 60, foi: 50, soutien_guerre: 40 },
        féodalité: { stabilité: 40, foi: 40, soutien_guerre: 50 },
        république: { stabilité: 45, foi: 30, soutien_guerre: 25 },
        théocratie: { stabilité: 55, foi: 80, soutien_guerre: 35 },
        dictature: { stabilité: 70, foi: 20, soutien_guerre: 75 }
    };
}

/**
 * Crée un royaume avec des valeurs par défaut
 * @param {Object} initialData - Données initiales du royaume
 * @returns {Object} Structure du royaume
 */
function createKingdomStructure(initialData) {
    // Déterminer le type de politique
    const politique = initialData.politique || 'monarchie';
    const politiqueBase = POLITIQUES[politique] || POLITIQUES.monarchie;
    
    // Calculer les modificateurs pour les stats en pourcentage uniquement
    const mods = initialData.statsModificateurs || {
        stabilité: 0,
        foi: 0,
        soutien_guerre: 0
    };
    
    // Fonction pour calculer les stats en pourcentage avec limites
    const calculerStatPourcentage = (base, mod) => {
        return Math.max(0, Math.min(100, base + mod));
    };
    
    // Calculer les stats en pourcentage finales
    const statsEnPourcentage = {
        stabilité: calculerStatPourcentage(politiqueBase.stabilité, mods.stabilité),
        foi: calculerStatPourcentage(politiqueBase.foi, mods.foi),
        soutien_guerre: calculerStatPourcentage(politiqueBase.soutien_guerre, mods.soutien_guerre)
    };
    
    // Valeurs par défaut pour les stats en points selon le type de politique
    let prestigeDefaut = 10;
    let influenceDefaut = 10;
    let prospéritéDefaut = 20;
    let rechercheDefaut = 10;
    
    switch(politique) {
        case 'monarchie':
            prestigeDefaut = 30;
            influenceDefaut = 20;
            prospéritéDefaut = 25;
            rechercheDefaut = 15;
            break;
        case 'féodalité':
            prestigeDefaut = 20;
            influenceDefaut = 15;
            prospéritéDefaut = 30;
            rechercheDefaut = 10;
            break;
        case 'république':
            prestigeDefaut = 10;
            influenceDefaut = 25;
            prospéritéDefaut = 45;
            rechercheDefaut = 35;
            break;
        case 'théocratie':
            prestigeDefaut = 25;
            influenceDefaut = 40;
            prospéritéDefaut = 20;
            rechercheDefaut = 20;
            break;
        case 'dictature':
            prestigeDefaut = 5;
            influenceDefaut = 10;
            prospéritéDefaut = 15;
            rechercheDefaut = 10;
            break;
    }
    
    // Déterminer le taux d'imposition par défaut selon la politique
    let tauxImpotDefaut = 10; // Valeur par défaut
    
    switch(politique) {
        case 'monarchie':
            tauxImpotDefaut = 10;
            break;
        case 'féodalité':
            tauxImpotDefaut = 15;
            break;
        case 'république':
            tauxImpotDefaut = 8;
            break;
        case 'théocratie':
            tauxImpotDefaut = 12;
            break;
        case 'dictature':
            tauxImpotDefaut = 20;
            break;
    }
    
    // Calculer les revenus initiaux avec le economyService
    let revenusTaxes = Math.floor((initialData.population?.total || 1000) * (tauxImpotDefaut / 100) * 0.6);
    let revenusCommerce = Math.floor((initialData.population?.total || 1000) * (tauxImpotDefaut / 100) * 0.3);
    let revenusProduction = Math.floor((initialData.population?.total || 1000) * (tauxImpotDefaut / 100) * 0.1);
    let revenusTotal = revenusTaxes + revenusCommerce + revenusProduction;
    
    // Calculer les dépenses administratives
    const depensesAdmin = Math.floor((initialData.population?.total || 1000) * 0.03);
    
    return {
        // Informations de base
        id: initialData.id || Date.now().toString(),
        name: initialData.name || '',
        description: initialData.description || '',
        owner: initialData.owner || '',
        createdAt: initialData.createdAt || new Date().toISOString(),
        politique: politique,
        
        // Statistiques de base pour les stats en pourcentage uniquement
        statsBase: { 
            stabilité: politiqueBase.stabilité,
            foi: politiqueBase.foi,
            soutien_guerre: politiqueBase.soutien_guerre
        },
        
        // Modificateurs de statistiques pour les stats en pourcentage uniquement
        statsModificateurs: {
            stabilité: mods.stabilité,
            foi: mods.foi,
            soutien_guerre: mods.soutien_guerre
        },
        
        // Statistiques primaires
        stats: {
            // Stats en pourcentage (base + modificateurs)
            stabilité: statsEnPourcentage.stabilité,
            foi: statsEnPourcentage.foi,
            soutien_guerre: statsEnPourcentage.soutien_guerre,
            
            // Stats en points (valeurs absolues)
            prestige: initialData.stats?.prestige !== undefined ? initialData.stats.prestige : prestigeDefaut,
            influence: initialData.stats?.influence !== undefined ? initialData.stats.influence : influenceDefaut,
            prospérité: initialData.stats?.prospérité !== undefined ? initialData.stats.prospérité : prospéritéDefaut,
            recherche: initialData.stats?.recherche !== undefined ? initialData.stats.recherche : rechercheDefaut
        },
        
        // Population et démographie
        population: {
            total: initialData.population?.total || 1000,
            capacité: initialData.population?.capacité || 2000, // Maximum supporté
            classes: {
                paysans: initialData.population?.classes?.paysans || 800, // 80%
                bourgeois: initialData.population?.classes?.bourgeois || 150, // 15%
                nobles: initialData.population?.classes?.nobles || 50, // 5%
            }
        },
        
        // Économie
        économie: {
            tauxImpot: initialData.économie?.tauxImpot || tauxImpotDefaut, // Taux d'imposition en %
            trésor: initialData.économie?.trésor || 1000, // Or
            revenus: {
                taxes: initialData.économie?.revenus?.taxes || revenusTaxes,
                commerce: initialData.économie?.revenus?.commerce || revenusCommerce,
                production: initialData.économie?.revenus?.production || revenusProduction,
                total: initialData.économie?.revenus?.total || revenusTotal
            },
            dépenses: {
                maintenance: initialData.économie?.dépenses?.maintenance || 20, // Or par mois
                armée: initialData.économie?.dépenses?.armée || 30, // Or par mois
                administration: initialData.économie?.dépenses?.administration || depensesAdmin, // Or par mois
                total: initialData.économie?.dépenses?.total || (50 + depensesAdmin) // Or par mois
            }
        },
        
        // Ressources
        ressources: {
            nourriture: {
                stock: initialData.ressources?.nourriture?.stock || 1000,
                production: initialData.ressources?.nourriture?.production || 100, // Par mois
                consommation: initialData.ressources?.nourriture?.consommation || 80, // Par mois
            },
            bois: {
                stock: initialData.ressources?.bois?.stock || 500,
                production: initialData.ressources?.bois?.production || 50, // Par mois
                consommation: initialData.ressources?.bois?.consommation || 30, // Par mois
            },
            pierre: {
                stock: initialData.ressources?.pierre?.stock || 500,
                production: initialData.ressources?.pierre?.production || 40, // Par mois
                consommation: initialData.ressources?.pierre?.consommation || 20, // Par mois
            },
            fer: {
                stock: initialData.ressources?.fer?.stock || 200,
                production: initialData.ressources?.fer?.production || 20, // Par mois
                consommation: initialData.ressources?.fer?.consommation || 15, // Par mois
            },
            luxe: {
                stock: initialData.ressources?.luxe?.stock || 50,
                production: initialData.ressources?.luxe?.production || 5, // Par mois
                consommation: initialData.ressources?.luxe?.consommation || 10, // Par mois
            }
        },
        
        // Armée et défense
        armée: {
            infanterie: {
                miliciens: initialData.armée?.infanterie?.miliciens || 30,
                soldats: initialData.armée?.infanterie?.soldats || 15,
                vétérans: initialData.armée?.infanterie?.vétérans || 5,
            },
            cavalerie: {
                légère: initialData.armée?.cavalerie?.légère || 0,
                lourde: initialData.armée?.cavalerie?.lourde || 0,
                chevaliers: initialData.armée?.cavalerie?.chevaliers || 0,
            },
            archers: {
                apprentis: initialData.armée?.archers?.apprentis || 10,
                arbalétriers: initialData.armée?.archers?.arbalétriers || 0,
                élites: initialData.armée?.archers?.élites || 0,
            },
            force_totale: initialData.armée?.force_totale || 60
        },
        
        // Bâtiments et infrastructures
        bâtiments: {
            château: {
                niveau: initialData.bâtiments?.château?.niveau || 1,
                défense: initialData.bâtiments?.château?.défense || 100,
                capacité: initialData.bâtiments?.château?.capacité || 200,
            },
            agriculture: {
                fermes: initialData.bâtiments?.agriculture?.fermes || 2,
                moulins: initialData.bâtiments?.agriculture?.moulins || 1,
                pâturages: initialData.bâtiments?.agriculture?.pâturages || 1,
            },
            production: {
                mines: initialData.bâtiments?.production?.mines || 1,
                carrières: initialData.bâtiments?.production?.carrières || 1,
                scieries: initialData.bâtiments?.production?.scieries || 1,
                forges: initialData.bâtiments?.production?.forges || 1,
            },
            militaires: {
                casernes: initialData.bâtiments?.militaires?.casernes || 1,
                écuries: initialData.bâtiments?.militaires?.écuries || 0,
                champs_de_tir: initialData.bâtiments?.militaires?.champs_de_tir || 0,
            },
            économiques: {
                marchés: initialData.bâtiments?.économiques?.marchés || 1,
                ateliers: initialData.bâtiments?.économiques?.ateliers || 1,
                guilde_marchande: initialData.bâtiments?.économiques?.guilde_marchande || 0,
            },
            religieux: {
                temple: initialData.bâtiments?.religieux?.temple || 1,
            }
        },
        
        // Territoire
        territoire: {
            capitale: {
                nom: initialData.territoire?.capitale?.nom || `Capitale de ${initialData.name || 'Royaume'}`,
                population: initialData.territoire?.capitale?.population || 500,
                défense: initialData.territoire?.capitale?.défense || 100,
            },
            taille_totale: initialData.territoire?.taille_totale || 10, // km²
            géographie: {
                climat: initialData.territoire?.géographie?.climat || 'tempéré',
                terrain: initialData.territoire?.géographie?.terrain || 'plaines',
                fertilité: initialData.territoire?.géographie?.fertilité || 50, // 0-100
                ressources_naturelles: initialData.territoire?.géographie?.ressources_naturelles || ['bois', 'pierre'],
            }
        },
        
        // Diplomatie
        diplomatie: {
            alliances: initialData.diplomatie?.alliances || [],
            ennemis: initialData.diplomatie?.ennemis || [],
            réputation: initialData.diplomatie?.réputation || 50, // 0-100
        }
    };
}

// Export des types de politique pour utilisation ailleurs
const TYPES_POLITIQUE = {
    MONARCHIE: 'monarchie',
    FÉODALITÉ: 'féodalité',
    RÉPUBLIQUE: 'république',
    THÉOCRATIE: 'théocratie',
    DICTATURE: 'dictature'
};

module.exports = {
    createKingdomStructure,
    TYPES_POLITIQUE
}; 