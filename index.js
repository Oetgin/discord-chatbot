// Require the necessary discord.js classes
const fs = require('fs');
const path = require('path');
const { Client, Collection, Events, GatewayIntentBits, SystemChannelFlagsBitField } = require('discord.js');
const { token } = require('./config.json');
const { get } = require('http');


const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const foldersPath = [path.join(__dirname, 'commands'), path.join(__dirname, 'dev-commands')];

function getAllJsFilePaths(folderPath) {
    let filePaths = [];

    // Read the contents of the folder
    const files = fs.readdirSync(folderPath);

    // Iterate through the files
    files.forEach(file => {
        const filePath = path.join(folderPath, file);

        // Check if it's a directory
        if (fs.statSync(filePath).isDirectory()) {
            // Recursively get files from the subfolder
            filePaths = filePaths.concat(getAllJsFilePaths(filePath));
        } else if (file.endsWith('.js')) {
            // Add the path if it's a .js file
            filePaths.push(filePath);
        }
    });

    return filePaths;
}

function getAllJsFilesinFolders(folderList) {

	const paths = [];
    for (const folder of folderList) {
		paths.push(...getAllJsFilePaths(folder));
	}

    return paths;
}


const commandFiles = getAllJsFilesinFolders(foldersPath);
for (const file of commandFiles) {
	const command = require(file);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
	}
}	


client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.login(token);