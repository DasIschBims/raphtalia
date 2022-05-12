const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const DiscordJS = require('discord.js')

module.exports = {
     data: new SlashCommandBuilder()
             .setName("status")
             .setDescription("Get Bot's status"),
  async execute(interaction) {
    function formatUptime(uptime) {
        let totalSeconds = uptime / 1000;
        const hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        return `${hours} hours, ${minutes} minutes and ${seconds} seconds`;
    }

    const uptime = Date.now() - interaction.client.readyAt;

    interaction.reply({embeds: [
      new MessageEmbed()
      .setColor("#58ff8d")
      .setTimestamp()
      .addFields([
         {name: "Servers", value: `${interaction.client.guilds.cache.size}`, inline: true},
         {name: "Online Users", value: `${interaction.client.users.cache.size}`, inline: true},
         {name: "Channels", value: `${interaction.client.channels.cache.size}`, inline: true},
         {name: "Ping", value: `${Date.now() - interaction.createdTimestamp}ms`, inline: true},
         {name: "API Latency", value: `${Math.round(interaction.client.ws.ping)}ms`, inline: true},
         {name: "Version", value: `${require('../../../package.json').version}`, inline: true},
         {name: "Uptime", value: `${formatUptime(uptime)}`, inline: false},
      ])
    ]})
    }
}