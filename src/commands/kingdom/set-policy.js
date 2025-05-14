const { SlashCommandBuilder } = require('discord.js');
const kingdomService = require('../../services/kingdomService');
const { createSuccessEmbed, createErrorEmbed, createKingdomEmbed } = require('../../utils/embeds');
const fs = require('fs');
const path = require('path');

// Charger les descriptions des politiques
const politiquesPath = path.join(__dirname, '../../data/politiques.json');
let politiquesData = {};
try {
    const politiquesRaw = fs.readFileSync(politiquesPath, 'utf8');
    politiquesData = JSON.parse(politiquesRaw).politiques;
} catch (error) {
    console.error('Erreur lors du chargement des politiques:', error);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-policy')
        .setDescription('Change le système politique de votre royaume')
        .addStringOption(option => {
            const politiqueOption = option.setName('politique')
                .setDescription('Nouveau système politique pour votre royaume')
                .setRequired(true);
                
            // Ajouter chaque type de politique comme choix
            politiqueOption.addChoices(
                { name: '👑 Monarchie - Stabilité: 60%, Foi: 50%, Soutien guerre: 40%', value: 'monarchie' },
                { name: '⚔️ Féodalité - Stabilité: 40%, Foi: 40%, Soutien guerre: 50%', value: 'féodalité' },
                { name: '🏛️ République - Stabilité: 45%, Foi: 30%, Soutien guerre: 25%', value: 'république' },
                { name: '✝️ Théocratie - Stabilité: 55%, Foi: 80%, Soutien guerre: 35%', value: 'théocratie' },
                { name: '👊 Dictature - Stabilité: 70%, Foi: 20%, Soutien guerre: 75%', value: 'dictature' },
            );
            
            return politiqueOption;
        })
        .addStringOption(option =>
            option.setName('confirmation')
                .setDescription('Tapez "confirmer" pour valider le changement (affecte vos statistiques de base)')
                .setRequired(true)),

    async execute(interaction) {
        const politique = interaction.options.getString('politique');
        const confirmation = interaction.options.getString('confirmation');
        const userId = interaction.user.id;
        
        // Vérification de la confirmation
        if (confirmation.toLowerCase() !== 'confirmer') {
            return interaction.reply({
                embeds: [createErrorEmbed(
                    '⚠️ Confirmation requise',
                    'Vous devez taper "confirmer" pour valider le changement de politique. Ce changement impactera les statistiques de base de votre royaume.'
                )],
                ephemeral: true
            });
        }
        
        // Obtenir la description de la politique choisie
        const politiqueDescription = politiquesData[politique]?.description || '';

        try {
            // Vérifier si l'utilisateur possède un royaume
            const existingKingdom = await kingdomService.findKingdomByOwner(userId);
            if (!existingKingdom) {
                return interaction.reply({
                    embeds: [createErrorEmbed(
                        '❌ Erreur',
                        'Vous ne possédez pas de royaume! Créez-en un d\'abord avec /create-kingdom.'
                    )],
                    ephemeral: true
                });
            }
            
            // Vérifier si c'est déjà la même politique
            if (existingKingdom.politique === politique) {
                return interaction.reply({
                    embeds: [createErrorEmbed(
                        '❌ Politique identique',
                        `Votre royaume utilise déjà le système politique "${politique}".`
                    )],
                    ephemeral: true
                });
            }

            // Message d'attente pour une meilleure UX
            await interaction.deferReply();
            
            // Mettre à jour la politique du royaume
            const anciennePolitique = existingKingdom.politique;
            const kingdom = await kingdomService.updateKingdom(existingKingdom.id, {
                politique: politique
            });

            // Information sur le changement de politique
            const politiqueInfo = `
**Ancien système:** ${anciennePolitique.charAt(0).toUpperCase() + anciennePolitique.slice(1)}
**Nouveau système:** ${politique.charAt(0).toUpperCase() + politique.slice(1)}

${politiqueDescription}

⚠️ Les statistiques de base de votre royaume ont été ajustées selon ce nouveau système politique.
`;
            
            await interaction.editReply({
                embeds: [
                    createSuccessEmbed(
                        '🏰 Politique Modifiée',
                        `La politique du royaume "${existingKingdom.name}" a été modifiée avec succès!\n\n${politiqueInfo}`
                    ),
                    createKingdomEmbed(kingdom)
                ]
            });

        } catch (error) {
            console.error(error);
            const replyMethod = interaction.deferred ? interaction.editReply : interaction.reply;
            await replyMethod.call(interaction, {
                embeds: [createErrorEmbed(
                    '❌ Erreur',
                    'Une erreur est survenue lors du changement de politique.'
                )],
                ephemeral: true
            });
        }
    },
}; 