const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
     data: new SlashCommandBuilder()
             .setName("stop")
             .setDescription("Stops the music and clears the queue."),

  async execute(interaction) {
    await interaction.deferReply()
    const queue = await interaction.client.player.createQueue(interaction.guild)

    if (!queue || !queue.playing) {
      return await interaction.editReply({embeds: [
        new MessageEmbed()
        .setColor("#FF0000")
        .setDescription("There is currently no music playing!")
        .setTimestamp()
      ], ephemeral: true})
    }

    await queue.destroy()

    await interaction.editReply({embeds: [
      new MessageEmbed()
        .setColor("#58ff8d")
        .setTitle("Stopped playing and cleared the queue!")
        .setTimestamp()
      ]})
   }
}