const { SlashCommandBuilder } = require('discord.js');
const { createPopulationInfoEmbed, createErrorEmbed } = require('../../utils/embeds');
const { findKingdomByOwner } = require('../../services/kingdomService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('population')
        .setDescription("Affiche des informations détaillées sur la démographie de votre royaume"),
    
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
        
        // Créer et envoyer l'embed de population
        const populationEmbed = createPopulationInfoEmbed(kingdom);
        await interaction.reply({ embeds: [populationEmbed] });
    }
}; 