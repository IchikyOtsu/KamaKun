const { SlashCommandBuilder } = require('discord.js');
const kingdomService = require('../../services/kingdomService');
const { createErrorEmbed, createKingdomEmbed } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kingdom-info')
        .setDescription('Affiche les informations de votre royaume'),

    async execute(interaction) {
        try {
            const kingdom = await kingdomService.findKingdomByOwner(interaction.user.id);
            
            if (!kingdom) {
                return interaction.reply({
                    embeds: [createErrorEmbed(
                        '❌ Erreur',
                        'Vous ne possédez pas encore de royaume! Utilisez `/create-kingdom` pour en créer un.'
                    )],
                    ephemeral: true
                });
            }

            await interaction.reply({
                embeds: [createKingdomEmbed(kingdom)]
            });

        } catch (error) {
            console.error(error);
            await interaction.reply({
                embeds: [createErrorEmbed(
                    '❌ Erreur',
                    'Une erreur est survenue lors de la récupération des informations du royaume.'
                )],
                ephemeral: true
            });
        }
    },
}; 