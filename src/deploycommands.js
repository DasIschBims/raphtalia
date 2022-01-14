const fs = require('fs')
const { token, appId } = require('./config.json')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')

const commands = []

const commandFolders = fs.readdirSync('./src/commands');
for (const folder of commandFolders) {
    // Filters out all the commands ending with ".js" after reading all the subfolders
	const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
        // Grabs all the command ".js" files
		const command = require(`./commands/${folder}/${file}`);
        // Pushes the commands to discord
		commands.push(command.data.toJSON());
	}
};
    
const restClient = new REST({version: "9"}).setToken(token)

console.log('Started refreshing application (/) commands.')

restClient.put(Routes.applicationCommands(appId), {body: commands})

console.log('Successfully reloaded application (/) commands.')