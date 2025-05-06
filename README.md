# KamaKun - Bot Discord

Un bot Discord utilisant les commandes slash modernes.

## Installation

1. Clonez ce dépôt
2. Installez les dépendances :
```bash
npm install
```
3. Configurez le fichier `.env` :
   - `TOKEN` : Le token de votre bot Discord
   - `CLIENT_ID` : L'ID de votre application Discord
4. Déployez les commandes slash :
```bash
node src/deploy-commands.js
```
5. Démarrez le bot :
```bash
npm start
```

Pour le développement, utilisez :
```bash
npm run dev
```

## Commandes disponibles

- `/ping` : Répond avec "Pong! 🏓"

## Structure du projet

- `src/commands/` : Contient toutes les commandes slash
- `src/index.js` : Point d'entrée principal du bot
- `src/deploy-commands.js` : Script pour déployer les commandes slash

## Ajouter une nouvelle commande

1. Créez un nouveau fichier dans `src/commands/`
2. Suivez le format de la commande ping
3. Exécutez `node src/deploy-commands.js` pour déployer la nouvelle commande

## Configuration

Le bot utilise les variables d'environnement suivantes :
- `TOKEN` : Le token de votre bot Discord 