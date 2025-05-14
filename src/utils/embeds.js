const { EmbedBuilder } = require('discord.js');

function createSuccessEmbed(title, description) {
    return new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle(title)
        .setDescription(description)
        .setTimestamp();
}

function createErrorEmbed(title, description) {
    return new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle(title)
        .setDescription(description)
        .setTimestamp();
}

function createKingdomEmbed(kingdom) {
    const statsEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`🏰 Royaume de ${kingdom.name}`)
        .setDescription(kingdom.description || 'Aucune description')
        .addFields(
            { name: '📊 Statistiques du Royaume', value: 
                `🛡️ Stabilité: ${kingdom.stats.stabilité}/100\n` +
                `👑 Prestige: ${kingdom.stats.prestige}/100\n` +
                `🌐 Influence: ${kingdom.stats.influence}/100\n` +
                `💰 Prospérité: ${kingdom.stats.prospérité}/100\n` +
                `✝️ Foi: ${kingdom.stats.foi}/100\n` +
                `🔬 Recherche: ${kingdom.stats.recherche}/100`
            },
            { name: '👥 Population', value:
                `Total: ${kingdom.population.total} habitants\n` +
                `Capacité: ${kingdom.population.capacité} habitants\n` +
                `Bonheur: ${kingdom.population.bonheur}/100\n` +
                `Classes: ${kingdom.population.classes.paysans} paysans, ` +
                `${kingdom.population.classes.bourgeois} bourgeois, ` +
                `${kingdom.population.classes.nobles} nobles`
            },
            { name: '💰 Économie', value:
                `Trésor: ${kingdom.économie.trésor} or\n` +
                `Revenus: ${kingdom.économie.revenus.total} or/mois\n` +
                `Dépenses: ${kingdom.économie.dépenses.total} or/mois`
            }
        )
        .setFooter({ 
            text: `Créé le ${new Date(kingdom.createdAt).toLocaleDateString()}` 
        });
    
    return statsEmbed;
}

function createResourcesEmbed(kingdom) {
    return new EmbedBuilder()
        .setColor('#8B4513') // Marron
        .setTitle(`📦 Ressources de ${kingdom.name}`)
        .addFields(
            { name: '🌾 Nourriture', value:
                `Stock: ${kingdom.ressources.nourriture.stock}\n` +
                `Production: ${kingdom.ressources.nourriture.production}/mois\n` +
                `Consommation: ${kingdom.ressources.nourriture.consommation}/mois`,
                inline: true
            },
            { name: '🪵 Bois', value:
                `Stock: ${kingdom.ressources.bois.stock}\n` +
                `Production: ${kingdom.ressources.bois.production}/mois\n` +
                `Consommation: ${kingdom.ressources.bois.consommation}/mois`,
                inline: true
            },
            { name: '🪨 Pierre', value:
                `Stock: ${kingdom.ressources.pierre.stock}\n` +
                `Production: ${kingdom.ressources.pierre.production}/mois\n` +
                `Consommation: ${kingdom.ressources.pierre.consommation}/mois`,
                inline: true
            },
            { name: '⚒️ Fer', value:
                `Stock: ${kingdom.ressources.fer.stock}\n` +
                `Production: ${kingdom.ressources.fer.production}/mois\n` +
                `Consommation: ${kingdom.ressources.fer.consommation}/mois`,
                inline: true
            },
            { name: '💎 Luxe', value:
                `Stock: ${kingdom.ressources.luxe.stock}\n` +
                `Production: ${kingdom.ressources.luxe.production}/mois\n` +
                `Consommation: ${kingdom.ressources.luxe.consommation}/mois`,
                inline: true
            }
        );
}

function createMilitaryEmbed(kingdom) {
    return new EmbedBuilder()
        .setColor('#8B0000') // Rouge foncé
        .setTitle(`⚔️ Forces Armées de ${kingdom.name}`)
        .addFields(
            { name: '🗡️ Infanterie', value:
                `Miliciens: ${kingdom.armée.infanterie.miliciens}\n` +
                `Soldats: ${kingdom.armée.infanterie.soldats}\n` +
                `Vétérans: ${kingdom.armée.infanterie.vétérans}`,
                inline: true
            },
            { name: '🏇 Cavalerie', value:
                `Légère: ${kingdom.armée.cavalerie.légère}\n` +
                `Lourde: ${kingdom.armée.cavalerie.lourde}\n` +
                `Chevaliers: ${kingdom.armée.cavalerie.chevaliers}`,
                inline: true
            },
            { name: '🏹 Archers', value:
                `Apprentis: ${kingdom.armée.archers.apprentis}\n` +
                `Arbalétriers: ${kingdom.armée.archers.arbalétriers}\n` +
                `Élites: ${kingdom.armée.archers.élites}`,
                inline: true
            },
            { name: '📊 Force totale', value: `${kingdom.armée.force_totale}`, inline: false }
        );
}

function createBuildingsEmbed(kingdom) {
    return new EmbedBuilder()
        .setColor('#964B00') // Marron
        .setTitle(`🏗️ Bâtiments de ${kingdom.name}`)
        .addFields(
            { name: '🏰 Château', value:
                `Niveau: ${kingdom.bâtiments.château.niveau}\n` +
                `Défense: ${kingdom.bâtiments.château.défense}\n` +
                `Capacité: ${kingdom.bâtiments.château.capacité} habitants`,
                inline: true
            },
            { name: '🌾 Agriculture', value:
                `Fermes: ${kingdom.bâtiments.agriculture.fermes}\n` +
                `Moulins: ${kingdom.bâtiments.agriculture.moulins}\n` +
                `Pâturages: ${kingdom.bâtiments.agriculture.pâturages}`,
                inline: true
            },
            { name: '⚒️ Production', value:
                `Mines: ${kingdom.bâtiments.production.mines}\n` +
                `Carrières: ${kingdom.bâtiments.production.carrières}\n` +
                `Scieries: ${kingdom.bâtiments.production.scieries}\n` +
                `Forges: ${kingdom.bâtiments.production.forges}`,
                inline: true
            },
            { name: '⚔️ Militaires', value:
                `Casernes: ${kingdom.bâtiments.militaires.casernes}\n` +
                `Écuries: ${kingdom.bâtiments.militaires.écuries}\n` +
                `Champs de tir: ${kingdom.bâtiments.militaires.champs_de_tir}`,
                inline: true
            },
            { name: '💰 Économiques', value:
                `Marchés: ${kingdom.bâtiments.économiques.marchés}\n` +
                `Ateliers: ${kingdom.bâtiments.économiques.ateliers}\n` +
                `Guilde marchande: ${kingdom.bâtiments.économiques.guilde_marchande}`,
                inline: true
            },
            { name: '✝️ Religieux', value:
                `Temple: ${kingdom.bâtiments.religieux.temple}`,
                inline: true
            }
        );
}

function createTerrainEmbed(kingdom) {
    return new EmbedBuilder()
        .setColor('#006400') // Vert foncé
        .setTitle(`🗺️ Territoire de ${kingdom.name}`)
        .addFields(
            { name: '📍 Capitale', value:
                `Nom: ${kingdom.territoire.capitale.nom}\n` +
                `Population: ${kingdom.territoire.capitale.population}\n` +
                `Défense: ${kingdom.territoire.capitale.défense}`,
                inline: true
            },
            { name: '🌍 Géographie', value:
                `Taille totale: ${kingdom.territoire.taille_totale} km²\n` +
                `Climat: ${kingdom.territoire.géographie.climat}\n` +
                `Terrain: ${kingdom.territoire.géographie.terrain}\n` +
                `Fertilité: ${kingdom.territoire.géographie.fertilité}/100\n` +
                `Ressources naturelles: ${kingdom.territoire.géographie.ressources_naturelles.join(', ')}`,
                inline: true
            }
        );
}

module.exports = {
    createSuccessEmbed,
    createErrorEmbed,
    createKingdomEmbed,
    createResourcesEmbed,
    createMilitaryEmbed,
    createBuildingsEmbed,
    createTerrainEmbed
}; 