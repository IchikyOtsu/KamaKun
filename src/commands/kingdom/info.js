const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Kingdom = require('../../models/Kingdom');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kingdom-info')
        .setDescription('Affiche les informations de votre royaume'),

    async execute(interaction) {
        try {
            const kingdom = await Kingdom.findOne({ owner: interaction.user.id });
            
            if (!kingdom) {
                return interaction.reply({
                    content: 'Vous ne possédez pas encore de royaume! Utilisez `/create-kingdom` pour en créer un.',
                    ephemeral: true
                });
            }

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`🏰 Royaume de ${kingdom.name}`)
                .setDescription(kingdom.description || 'Aucune description')
                .addFields(
                    { name: '📊 Statistiques', value: 
                        `Population: ${kingdom.population}\n` +
                        `Or: ${kingdom.gold}\n` +
                        `Nourriture: ${kingdom.food}\n` +
                        `Force militaire: ${kingdom.military}`
                    },
                    { name: '🏗️ Bâtiments', value:
                        `Fermes: ${kingdom.buildings.farms}\n` +
                        `Mines: ${kingdom.buildings.mines}\n` +
                        `Caserne: ${kingdom.buildings.barracks}\n` +
                        `Marchés: ${kingdom.buildings.markets}`
                    },
                    { name: '📦 Ressources', value:
                        `Bois: ${kingdom.resources.wood}\n` +
                        `Pierre: ${kingdom.resources.stone}\n` +
                        `Fer: ${kingdom.resources.iron}\n` +
                        `Mines d'or: ${kingdom.resources.goldMines}`
                    },
                    { name: '🗺️ Territoire', value:
                        `Taille: ${kingdom.territory.size} km²\n` +
                        `Climat: ${kingdom.territory.climate}\n` +
                        `Fertilité: ${kingdom.territory.fertility}%`
                    }
                )
                .setFooter({ text: `Créé le ${kingdom.createdAt.toLocaleDateString()}` });

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'Une erreur est survenue lors de la récupération des informations du royaume.',
                ephemeral: true
            });
        }
    },
}; 