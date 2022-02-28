const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
     data: new SlashCommandBuilder()
             .setName("shuffle")
             .setDescription("Shuffles the current queue"),

  async execute(interaction) {
    await interaction.deferReply()
    const queue = interaction.client.player.getQueue(interaction.guild)

    if (
        interaction.guild.me.voice.channelId &&
        interaction.member.voice.channelId !==
        interaction.guild.me.voice.channelId
      ) {
        return await interaction.followUp({
            embeds: [
              new MessageEmbed()
              .setColor("#FF0000")
              .setDescription("❌ | You have to be in my music channel to do that!")
              .setTimestamp()
          ]})
      }

    if (!queue) {
        return await interaction.followUp({
            embeds: [
                new MessageEmbed()
                .setColor("#FF0000")
                .setDescription("❌ | The queue is empty, how would I shuffle that?")
                .setTimestamp()
        ]})
    }

    await queue.shuffle();
    return await interaction.followUp({ embeds: [
            new MessageEmbed()
            .setColor("#58FF8D")
            .setDescription("🔀 | Shuffled Playlist successfully!")
            .setTimestamp()
    ]})
  }
}