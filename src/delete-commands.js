const { REST, Routes } = require('discord.js');
require('dotenv').config();

const rest = new REST().setToken(process.env.TOKEN);
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

// Fonction pour supprimer toutes les commandes globales
async function deleteGlobalCommands() {
    try {
        console.log('Suppression des commandes globales...');
        
        // Récupérer toutes les commandes globales existantes
        const commands = await rest.get(
            Routes.applicationCommands(CLIENT_ID)
        );
        
        console.log(`${commands.length} commandes globales trouvées.`);
        
        // Supprimer chaque commande
        for (const command of commands) {
            await rest.delete(
                Routes.applicationCommand(CLIENT_ID, command.id)
            );
            console.log(`Commande globale supprimée: ${command.name} (${command.id})`);
        }
        
        console.log('Toutes les commandes globales ont été supprimées.');
    } catch (error) {
        console.error('Erreur lors de la suppression des commandes globales:', error);
    }
}

// Fonction pour supprimer toutes les commandes d'un serveur spécifique
async function deleteGuildCommands() {
    if (!GUILD_ID) {
        console.log('Aucun GUILD_ID spécifié, ignorant la suppression des commandes de serveur.');
        return;
    }
    
    try {
        console.log(`Suppression des commandes du serveur ${GUILD_ID}...`);
        
        // Récupérer toutes les commandes du serveur existantes
        const commands = await rest.get(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID)
        );
        
        console.log(`${commands.length} commandes de serveur trouvées.`);
        
        // Supprimer chaque commande
        for (const command of commands) {
            await rest.delete(
                Routes.applicationGuildCommand(CLIENT_ID, GUILD_ID, command.id)
            );
            console.log(`Commande de serveur supprimée: ${command.name} (${command.id})`);
        }
        
        console.log('Toutes les commandes du serveur ont été supprimées.');
    } catch (error) {
        console.error('Erreur lors de la suppression des commandes du serveur:', error);
    }
}

// Exécuter les deux fonctions de suppression
(async () => {
    console.log('Début de la suppression des commandes...');
    await deleteGlobalCommands();
    await deleteGuildCommands();
    console.log('Suppression des commandes terminée.');
})(); 