const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

const commands = [];
const commandsPath = path.join(__dirname, 'commands');

// Liste des commandes à exclure
const EXCLUDED_COMMANDS = ['simulate-month', 'kingdom-history'];

// Fonction récursive pour charger les commandes dans les sous-dossiers
function loadCommands(dir) {
    const files = fs.readdirSync(dir);
    console.log(`Lecture du dossier: ${dir}`);
    
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            console.log(`Dossier trouvé: ${file}`);
            loadCommands(filePath);
        } else if (file.endsWith('.js')) {
            console.log(`Commande trouvée: ${file}`);
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                // Vérifier si la commande doit être exclue
                if (EXCLUDED_COMMANDS.includes(command.data.name)) {
                    console.log(`Commande exclue: ${command.data.name}`);
                } else {
                    console.log(`Commande chargée: ${command.data.name}`);
                    commands.push(command.data.toJSON());
                }
            }
        }
    }
}

// Charger toutes les commandes
loadCommands(commandsPath);

console.log('Commandes à déployer:', commands.map(cmd => cmd.name).join(', '));

const rest = new REST().setToken(process.env.TOKEN);

// Récupérer les IDs depuis .env
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

// Vérifier que les ID sont définis
if (!CLIENT_ID) {
    console.error('CLIENT_ID non défini dans le fichier .env');
    process.exit(1);
}

(async () => {
    try {
        console.log('Début du déploiement des commandes slash...');
        console.log('Client ID:', CLIENT_ID);
        
        // Déployer les commandes uniquement à un endroit
        if (GUILD_ID) {
            // Déployer les commandes sur un serveur spécifique (recommandé pour le développement)
            console.log(`Déploiement des commandes sur le serveur spécifique (ID: ${GUILD_ID})`);
            const data = await rest.put(
                Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
                { body: commands }
            );
            console.log(`Commandes slash déployées avec succès sur le serveur! ${data.length} commandes enregistrées:`);
            data.forEach(cmd => console.log(`- ${cmd.name}`));
        } else {
            // Déployer les commandes globalement (pas recommandé pour le développement)
            console.log('ATTENTION: Déploiement des commandes globalement (tous les serveurs)');
            console.log('Cette opération peut prendre jusqu\'à une heure pour être effective.');
            console.log('Pour un développement plus rapide, définissez GUILD_ID dans le fichier .env');
            
            const confirmation = await new Promise(resolve => {
                const readline = require('readline').createInterface({
                    input: process.stdin,
                    output: process.stdout
                });
                
                readline.question('Voulez-vous continuer? (y/n): ', answer => {
                    readline.close();
                    resolve(answer.toLowerCase() === 'y');
                });
            });
            
            if (!confirmation) {
                console.log('Déploiement annulé.');
                return;
            }
            
            const data = await rest.put(
                Routes.applicationCommands(CLIENT_ID),
                { body: commands }
            );
            console.log(`Commandes slash déployées globalement avec succès! ${data.length} commandes enregistrées:`);
            data.forEach(cmd => console.log(`- ${cmd.name}`));
        }
    } catch (error) {
        console.error('Erreur lors du déploiement:', error);
    }
})(); 