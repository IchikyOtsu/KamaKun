const { SlashCommandBuilder } = require('discord.js');
const Kingdom = require('../../models/Kingdom');

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
            const existingKingdom = await Kingdom.findOne({ owner: userId });
            if (existingKingdom) {
                return interaction.reply({
                    content: 'Vous possédez déjà un royaume!',
                    ephemeral: true
                });
            }

            // Vérifier si le nom est déjà pris
            const nameExists = await Kingdom.findOne({ name: name });
            if (nameExists) {
                return interaction.reply({
                    content: 'Ce nom de royaume est déjà pris!',
                    ephemeral: true
                });
            }

            // Créer le nouveau royaume
            const kingdom = new Kingdom({
                name,
                description,
                owner: userId
            });

            await kingdom.save();

            await interaction.reply({
                content: `🏰 Le royaume "${name}" a été créé avec succès!\n` +
                        `Population: ${kingdom.population}\n` +
                        `Or: ${kingdom.gold}\n` +
                        `Nourriture: ${kingdom.food}\n` +
                        `Force militaire: ${kingdom.military}`,
                ephemeral: true
            });

        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'Une erreur est survenue lors de la création du royaume.',
                ephemeral: true
            });
        }
    },
}; 