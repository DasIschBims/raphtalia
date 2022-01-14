const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
     data: new SlashCommandBuilder()
             .setName("userinfo")
             .setDescription("Displays information about specific user.")
             .addUserOption(option => option.setName("user").setDescription("Pick a user.")),
  async execute(interaction) {

    if (interaction.options.getMember("user") === null) {
        interaction.reply({embeds: [
            new MessageEmbed()
            .setTitle(`${interaction.user.tag}`)
            .setColor("#58ff8d")
            .setThumbnail(interaction.user.avatarURL({dynamic: true}))
            .setTimestamp()
            .addFields([
              {
                name: "Creation date =>",
                value: `<t:${Math.round(interaction.user.createdTimestamp/1000)}>`,
                inline: true
              },
              {
               name: "Joined this guild =>",
               value: `<t:${Math.round(interaction.member.joinedTimestamp/1000)}>`,
               inline: true
             }
            ])
          ]})
    } else {
        const pickeduser = interaction.options.getMember("user")
        interaction.reply({embeds: [
            new MessageEmbed()
            .setTitle(`${pickeduser.user.tag}`)
            .setColor("#58ff8d")
            .setThumbnail(pickeduser.user.avatarURL({dynamic: true}))
            .setTimestamp()
            .addFields([
              {
                name: "Creation date =>",
                value: `<t:${Math.round(pickeduser.user.createdTimestamp/1000)}>`,
                inline: true
              },
              {
               name: "Joined this guild =>",
               value: `<t:${Math.round(pickeduser.joinedTimestamp/1000)}>`,
               inline: true
             }
            ])
          ]})
    }
  }
}