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
    const politiqueFormatted = kingdom.politique.charAt(0).toUpperCase() + kingdom.politique.slice(1);
    
    const formatModifier = (value) => {
        if (value > 0) return `+${value}`;
        if (value < 0) return `${value}`;
        return "+0";
    };
    
    const soldeMensuel = kingdom.économie.revenus.total - kingdom.économie.dépenses.total;
    const soldeMensuelFormatted = soldeMensuel >= 0 ? `+${soldeMensuel}` : `${soldeMensuel}`;
    
    const statsEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`🏰 Royaume de ${kingdom.name}`)
        .setDescription(kingdom.description || 'Aucune description')
        .addFields(
            { name: '📊 Statistiques du Royaume', value: 
                `🛡️ Stabilité: ${kingdom.stats.stabilité}% (${kingdom.statsBase.stabilité}${formatModifier(kingdom.statsModificateurs.stabilité)})\n` +
                `✝️ Foi: ${kingdom.stats.foi}% (${kingdom.statsBase.foi}${formatModifier(kingdom.statsModificateurs.foi)})\n` +
                `⚔️ Soutien à la guerre: ${kingdom.stats.soutien_guerre}% (${kingdom.statsBase.soutien_guerre}${formatModifier(kingdom.statsModificateurs.soutien_guerre)})\n` +
                `👑 Prestige: ${kingdom.stats.prestige}\n` +
                `🌐 Influence: ${kingdom.stats.influence}\n` +
                `💰 Prospérité: ${kingdom.stats.prospérité}\n` +
                `🔬 Recherche: ${kingdom.stats.recherche}`
            },
            { name: '👑 Politique', value: `${politiqueFormatted}`, inline: true },
            { name: '🗺️ Territoire', value: `${kingdom.territoire.taille_totale} km²`, inline: true },
            { name: '👥 Population', value:
                `Total: ${kingdom.population.total} habitants\n` +
                `Capacité: ${kingdom.population.capacité} habitants\n` +
                `Classes: ${kingdom.population.classes.paysans} paysans, ` +
                `${kingdom.population.classes.bourgeois} bourgeois, ` +
                `${kingdom.population.classes.nobles} nobles`
            },
            { name: '💰 Économie', value:
                `Trésor: ${kingdom.économie.trésor} or\n` +
                `Taux d'imposition: ${kingdom.économie.tauxImpot || 10}%\n` +
                `Revenus: ${kingdom.économie.revenus.total} or/mois\n` +
                `Dépenses: ${kingdom.économie.dépenses.total} or/mois\n` +
                `Solde mensuel: ${soldeMensuelFormatted} or`
            }
        )
        .setFooter({ 
            text: `Créé le ${new Date(kingdom.createdAt).toLocaleDateString()}` 
        });
    
    return statsEmbed;
}

function createEconomyInfoEmbed(kingdom) {
    const tauxImpot = kingdom.économie.tauxImpot || 10;
    const prospérité = kingdom.stats.prospérité;
    const population = kingdom.population.total;
    
    const revenusBase = Math.floor(population * (tauxImpot / 100) * (0.5 + prospérité / 100));
    const depensesAdmin = Math.floor(population * 0.03);
    
    const prospéritéPlusElevée = prospérité + 10;
    const revenusAvecProspéritéPlusElevée = Math.floor(population * (tauxImpot / 100) * (0.5 + prospéritéPlusElevée / 100));
    const impactProspérité = revenusAvecProspéritéPlusElevée - revenusBase;
    
    const tauxImpotPlusElevé = tauxImpot + 5;
    const revenusAvecTauxPlusElevé = Math.floor(population * (tauxImpotPlusElevé / 100) * (0.5 + prospérité / 100));
    const impactTauxImpot = revenusAvecTauxPlusElevé - revenusBase;

    return new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle(`💰 Économie de ${kingdom.name}`)
        .setDescription(`Comprendre les mécanismes économiques de votre royaume`)
        .addFields(
            { name: '📈 Revenus - Formule', value:
                `\`Revenus = Population × (Taux d'Impôt/100) × (0,5 + Prospérité/100)\`\n` +
                `= ${population} × (${tauxImpot}/100) × (0,5 + ${prospérité}/100)\n` +
                `= ${revenusBase} or par mois`,
                inline: false
            },
            { name: '📊 Facteurs des revenus', value:
                `**Population:** ${population} habitants → +${Math.floor(population * 0.01)} or par +100 habitants\n` +
                `**Prospérité:** ${prospérité} → +${impactProspérité} or pour +10 points\n` +
                `**Taux d'impôt:** ${tauxImpot}% → +${impactTauxImpot} or pour +5%\n`,
                inline: true
            },
            { name: '📉 Dépenses - Formule', value:
                `**Administration:** \`Pop × 0,03\`\n` +
                `= ${population} × 0,03\n` +
                `= ${depensesAdmin} or par mois\n\n` +
                `**Autres dépenses:** Coûts militaires et maintenance des infrastructures`,
                inline: true
            },
            { name: '💡 Conseils', value:
                `• Augmentez votre prospérité pour améliorer vos revenus\n` +
                `• Un taux d'impôt trop élevé peut nuire à la stabilité du royaume\n` +
                `• Une stabilité élevée favorise la croissance démographique qui augmente les revenus\n` +
                `• Surveillez le solde mensuel pour éviter la faillite`,
                inline: false
            }
        );
}

function createPopulationInfoEmbed(kingdom) {
    const stabilité = kingdom.stats.stabilité;
    const population = kingdom.population.total;
    
    let croissanceBase = 0;
    let statusCroissance = "";
    
    if (stabilité >= 70) {
        croissanceBase = 0.02;
        statusCroissance = "Boom démographique";
    } else if (stabilité <= 40) {
        croissanceBase = 0;
        statusCroissance = "Stagnation";
    } else {
        croissanceBase = 0.01 + ((stabilité - 40) / 30) * 0.01;
        statusCroissance = "Croissance normale";
    }
    
    const croissanceMensuelle = Math.floor(population * croissanceBase * (stabilité / 100));
    
    const stabilitéPlusElevée = Math.min(100, stabilité + 10);
    let croissanceBasePlusElevée = 0;
    
    if (stabilitéPlusElevée >= 70) {
        croissanceBasePlusElevée = 0.02;
    } else if (stabilitéPlusElevée <= 40) {
        croissanceBasePlusElevée = 0;
    } else {
        croissanceBasePlusElevée = 0.01 + ((stabilitéPlusElevée - 40) / 30) * 0.01;
    }
    
    const croissanceAvecStabilitéPlusElevée = Math.floor(population * croissanceBasePlusElevée * (stabilitéPlusElevée / 100));
    const impactStabilité = croissanceAvecStabilitéPlusElevée - croissanceMensuelle;

    return new EmbedBuilder()
        .setColor('#9370DB')
        .setTitle(`👥 Population de ${kingdom.name}`)
        .setDescription(`Comprendre la croissance démographique de votre royaume`)
        .addFields(
            { name: '📈 Formule de croissance', value:
                `\`Croissance = Population × Taux de Base × (Stabilité/100)\`\n` +
                `= ${population} × ${croissanceBase.toFixed(3)} × (${stabilité}/100)\n` +
                `= +${croissanceMensuelle} habitants par mois`,
                inline: false
            },
            { name: '🛡️ Stabilité et Croissance', value:
                `**Statut actuel:** ${statusCroissance} (${stabilité}%)\n` +
                `**Seuils importants:**\n` +
                `• Stabilité ≥ 70%: Boom démographique (taux base = 0,02)\n` +
                `• Stabilité entre 40% et 70%: Croissance normale (taux variable)\n` +
                `• Stabilité ≤ 40%: Stagnation (taux base = 0)`,
                inline: true
            },
            { name: '📊 Impact des changements', value:
                `**+10% de stabilité:** ${impactStabilité >= 0 ? '+' : ''}${impactStabilité} habitants/mois\n` +
                `**Classes sociales:** La croissance est répartie en:\n` +
                `• 80% paysans (+${Math.floor(croissanceMensuelle * 0.8)})\n` +
                `• 15% bourgeois (+${Math.floor(croissanceMensuelle * 0.15)})\n` +
                `• 5% nobles (+${croissanceMensuelle - Math.floor(croissanceMensuelle * 0.8) - Math.floor(croissanceMensuelle * 0.15)})`,
                inline: true
            },
            { name: '💡 Conseils', value:
                `• Maintenez la stabilité au-dessus de 70% pour maximiser la croissance\n` +
                `• Un taux d'imposition élevé peut réduire la stabilité\n` +
                `• Plus la population est importante, plus les revenus potentiels sont élevés\n` +
                `• Mais les dépenses administratives augmentent aussi (Population × 0,03)`,
                inline: false
            }
        );
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
            { name: '📊 Force totale', value: `${kingdom.armée.force_totale}`, inline: false },
            { name: '🪖 Soutien à la guerre', value: `${kingdom.stats.soutien_guerre}% (${kingdom.statsBase.soutien_guerre}${kingdom.statsModificateurs.soutien_guerre >= 0 ? '+' + kingdom.statsModificateurs.soutien_guerre : kingdom.statsModificateurs.soutien_guerre})`, inline: false }
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
    createEconomyInfoEmbed,
    createPopulationInfoEmbed,
    createResourcesEmbed,
    createMilitaryEmbed,
    createBuildingsEmbed,
    createTerrainEmbed
}; 