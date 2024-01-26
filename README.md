
# Discord ChatBot

Un ChatBot local connecté à Discord.



## Requirements

Ce projet requiert Linux ou MacOS (limitations [ollama](https://ollama.ai/download)).

Pour lancer ce projet sur Windows, [installer wsl](https://learn.microsoft.com/fr-fr/windows/wsl/install).

Alternativement, il est possible de lancer le serveur ollama (`ollama serve`) sur une machine Linux ou MacOS et d'y accéder depuis une autre machine.
## Installation

Après avoir téléchargé le fichier du projet :

[Créer un bot Discord](https://discord.com/developers/applications).

Dans [le fichier de configuraton](config.json), rentrer le token du bot, ainsi que son identifiant et l'identifiant du serveur de test (optionnel). 

Installer ollama : \
`curl https://ollama.ai/install.sh | sh`

Télécharger les modèles nécessaires : \
`ollama pull mistral:latest` \
`ollama pull dolphin-mixtral:latest`
## Lancer le projet

Pour lancer le projet, il suffit d'exécuter la commande `node index.js` dans le dossier racine du projet.

## Fonctionnalités

- Écriture de la réponse en temps réel
- Attente lors de prompts simultanés
- Mémoire des chats
## Pourquoi ?

- Performances supérieures à GPT 3.5 Turbo
- Gratuit
- Interface agréable
- Permet de discuter avec l'IA directement dans un serveur Discord
- Permet d'accéder à l'IA à distance
## Basé sur

**IA :** node.js : ollama-node (mistral), python : langhain

**Autres :** discord.js, python-shell
