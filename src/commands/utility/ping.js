const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
     data: new SlashCommandBuilder()
             .setName("ping")
             .setDescription("Draw ping and api latency."),
  async execute(interaction) {
         interaction.reply({embeds: [
           new MessageEmbed()
           .setTitle("Bot stats")
           .setColor("#58ff8d")
           .setTimestamp()
           .addFields([
             {
               name: "Ping",
               value: "```ini\n" + `[ ${Date.now() - interaction.createdTimestamp}` + "ms ]```",
               inline: true
             },
             {
              name: "API Latency",
              value: "```ini\n" + `[ ${Math.round(interaction.client.ws.ping)}` + "ms ]```",
              inline: true
            }
           ])
         ]})
    }
}