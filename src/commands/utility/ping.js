const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
     data: new SlashCommandBuilder()
             .setName("ping")
             .setDescription("Draw ping and api latency."),
  async execute(interaction) {
         interaction.reply({embeds: [
           new MessageEmbed()
           .setColor("#58ff8d")
           .setTimestamp()
           .addFields([
             {
               name: "Pong! 🏓",
               value:  `Ping: **${Date.now() - interaction.createdTimestamp}ms**\nAPI-Latency: **${Math.round(interaction.client.ws.ping)}ms**`,
               inline: true
             }
           ])
         ]})
    }
}