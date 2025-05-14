const { SlashCommandBuilder } = require('discord.js');
const kingdomService = require('../../services/kingdomService');
const { createSuccessEmbed, createErrorEmbed, createKingdomEmbed } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-kingdom')
        .setDescription('Crée un nouveau royaume')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Le nom de votre royaume')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Description de votre royaume')
                .setRequired(false)),

    async execute(interaction) {
        const name = interaction.options.getString('name');
        const description = interaction.options.getString('description') || '';
        const userId = interaction.user.id;

        try {
            // Vérifier si l'utilisateur a déjà un royaume
            const existingKingdom = await kingdomService.findKingdomByOwner(userId);
            if (existingKingdom) {
                return interaction.reply({
                    embeds: [createErrorEmbed(
                        '❌ Erreur',
                        'Vous possédez déjà un royaume!'
                    )],
                    ephemeral: true
                });
            }

            // Vérifier si le nom est déjà pris
            const nameExists = await kingdomService.findKingdomByName(name);
            if (nameExists) {
                return interaction.reply({
                    embeds: [createErrorEmbed(
                        '❌ Erreur',
                        'Ce nom de royaume est déjà pris!'
                    )],
                    ephemeral: true
                });
            }

            // Créer le nouveau royaume
            const kingdom = await kingdomService.createKingdom({
                name,
                description,
                owner: userId,
                population: 1000,
                gold: 1000,
                food: 1000,
                military: 100,
                resources: {
                    wood: 500,
                    stone: 500,
                    iron: 200,
                    goldMines: 1
                },
                buildings: {
                    farms: 2,
                    mines: 1,
                    barracks: 1,
                    markets: 1
                },
                alliances: [],
                enemies: [],
                territory: {
                    size: 1,
                    climate: 'tempéré',
                    fertility: 50
                }
            });

            await interaction.reply({
                embeds: [
                    createSuccessEmbed(
                        '🏰 Royaume Créé',
                        `Le royaume "${name}" a été créé avec succès!`
                    ),
                    createKingdomEmbed(kingdom)
                ]
            });

        } catch (error) {
            console.error(error);
            await interaction.reply({
                embeds: [createErrorEmbed(
                    '❌ Erreur',
                    'Une erreur est survenue lors de la création du royaume.'
                )],
                ephemeral: true
            });
        }
    },
}; 