const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
     data: new SlashCommandBuilder()
             .setName("serverinfo")
             .setDescription("Displays information about the guild."),
  async execute(interaction) {
        interaction.reply({embeds: [
            new MessageEmbed()
            .setTitle(`${interaction.guild.name}`)
            .setColor("#58ff8d")
            .setThumbnail(`${interaction.guild.iconURL({dynamic: true})}`)
            .setTimestamp()
            .addFields([
              {
                  name: "Creation date =>",
                  value: `<t:${Math.round(interaction.guild.createdTimestamp/1000)}>`,
                  inline: true
              },
              {
                  name: "Current Members =>",
                  value: "```ini\n" + `[ ${interaction.guild.memberCount} Members ]` + "```",
                  inline: true
              },
              {
                  name: "Roles =>",
                  value: "```ini\n" + `[ ${Math.floor(interaction.guild.roles.cache.size)} Roles ]` + "```",
                  inline: true
              },
              {
                  name: "Channels =>",
                  value: "```ini\n" + `[ ${interaction.guild.channels.cache.filter(filter => filter.type === 'GUILD_TEXT').size} Text ] [ ${interaction.guild.channels.cache.filter(filter => filter.type === 'GUILD_VOICE').size} Voice ]` + "```",
                  inline: false
              }
            ])
          ]})
  }
}
