// Structure simplifiée d'un royaume pour RP géopolitique

/**
 * Crée un royaume avec des valeurs par défaut
 * @param {Object} initialData - Données initiales du royaume
 * @returns {Object} Structure du royaume
 */
function createKingdomStructure(initialData) {
    return {
        // Informations de base
        id: initialData.id || Date.now().toString(),
        name: initialData.name || '',
        description: initialData.description || '',
        owner: initialData.owner || '',
        createdAt: initialData.createdAt || new Date().toISOString(),
        
        // Statistiques primaires
        stats: {
            stabilité: initialData.stats?.stabilité || 50, // 0-100
            prestige: initialData.stats?.prestige || 10, // 0-100
            influence: initialData.stats?.influence || 10, // 0-100
            prospérité: initialData.stats?.prospérité || 30, // 0-100
            foi: initialData.stats?.foi || 40, // 0-100
            recherche: initialData.stats?.recherche || 20, // 0-100
        },
        
        // Population et démographie
        population: {
            total: initialData.population?.total || 1000,
            capacité: initialData.population?.capacité || 2000, // Maximum supporté
            bonheur: initialData.population?.bonheur || 60, // 0-100
            classes: {
                paysans: initialData.population?.classes?.paysans || 800, // 80%
                bourgeois: initialData.population?.classes?.bourgeois || 150, // 15%
                nobles: initialData.population?.classes?.nobles || 50, // 5%
            }
        },
        
        // Économie
        économie: {
            trésor: initialData.économie?.trésor || 1000, // Or
            revenus: {
                taxes: initialData.économie?.revenus?.taxes || 50, // Or par mois
                commerce: initialData.économie?.revenus?.commerce || 30, // Or par mois
                production: initialData.économie?.revenus?.production || 20, // Or par mois
                total: initialData.économie?.revenus?.total || 100 // Or par mois
            },
            dépenses: {
                maintenance: initialData.économie?.dépenses?.maintenance || 20, // Or par mois
                armée: initialData.économie?.dépenses?.armée || 30, // Or par mois
                administration: initialData.économie?.dépenses?.administration || 10, // Or par mois
                total: initialData.économie?.dépenses?.total || 60 // Or par mois
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
            taille_totale: initialData.territoire?.taille_totale || 1, // km²
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

module.exports = {
    createKingdomStructure
}; 