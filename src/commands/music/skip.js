const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
     data: new SlashCommandBuilder()
             .setName("skip")
             .setDescription("Skips the currently playing song"),

  async execute(interaction) {
    await interaction.deferReply()
    const queue = interaction.client.player.getQueue(interaction.guild)

    if (
        interaction.guild.me.voice.channelId &&
        interaction.member.voice.channelId !==
        interaction.guild.me.voice.channelId
      ) {
        return await interaction.followUp({ embeds: [
              new MessageEmbed()
              .setColor("#FF0000")
              .setDescription("❌ | You have to be in my music channel to do that!")
              .setTimestamp()
        ]})
      }

    if (!queue || !queue.playing) {
        return await interaction.followUp({ embeds: [
                new MessageEmbed()
                .setColor("#FF0000")
                .setDescription("❌ | There is currently no music playing!")
                .setTimestamp()
        ]})
    }

    if (queue.repeatMode !== 0) queue.setRepeatMode(0);
      const currentSong = queue.current;
      
      await queue.skip();
      return await interaction.followUp({ embeds: [
            new MessageEmbed()
            .setColor("#58FF8D")
            .setDescription(`⏩ | Skipped **${currentSong}**`)
            .setTimestamp()
      ]})
  }
}