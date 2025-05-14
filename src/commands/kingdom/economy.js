const { SlashCommandBuilder } = require('discord.js');
const { createEconomyInfoEmbed, createErrorEmbed } = require('../../utils/embeds');
const { findKingdomByOwner } = require('../../services/kingdomService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('economy')
        .setDescription("Affiche des informations détaillées sur l'économie de votre royaume"),
    
    async execute(interaction) {
        const userId = interaction.user.id;
        
        // Récupérer le royaume du joueur
        const kingdom = await findKingdomByOwner(userId);
        
        // Vérifier si le joueur possède un royaume
        if (!kingdom) {
            await interaction.reply({ 
                embeds: [createErrorEmbed(
                    "Aucun royaume trouvé", 
                    "Vous devez d'abord créer un royaume avec la commande `/create`."
                )], 
                ephemeral: true 
            });
            return;
        }
        
        // Créer et envoyer l'embed d'économie
        const economyEmbed = createEconomyInfoEmbed(kingdom);
        await interaction.reply({ embeds: [economyEmbed] });
    }
}; 