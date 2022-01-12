const fs = require('fs')
const { token, id } = require('./config.json')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')

const commands = []

const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.ts'))

commandFiles.forEach(commandFile => {
   const command = require(`./commands/${commandFile}`)
   commands.push(command.data.toJSON())
})
    
const restClient = new REST({version: "9"}).setToken(token)

console.log('Started refreshing application (/) commands.')

restClient.put(Routes.applicationCommands(id), {body: commands})

console.log('Successfully reloaded application (/) commands.')