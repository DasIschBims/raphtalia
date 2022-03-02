const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
     data: new SlashCommandBuilder()
             .setName("volume")
             .setDescription("Change the bots volume.")
             .addIntegerOption((int) => int.setName("volume").setDescription("Enter a number from 1 to 100 to change the volume to. (default: 80)").setMaxValue(100).setMinValue(1).setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply()
    const queue = interaction.client.player.getQueue(interaction.guild)
    const volume = interaction.options.getInteger("volume")
    
    if (volume < 20) {
        volumeEmote = "🔈"
    }

    if (volume > 50) {
        volumeEmote = "🔉"
    }

    if (volume > 80) {
        volumeEmote = "🔊"
    }

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

    if (!queue.playing) {
        return await interaction.followUp({
            embeds: [
                new MessageEmbed()
                .setColor("#FF0000")
                .setDescription("❌ | There is currently no music playing!")
                .setTimestamp()
        ]})
    }

    await queue.setVolume(volume);
    return await interaction.followUp({ embeds: [
            new MessageEmbed()
            .setColor("#58FF8D")
            .setDescription(`${volumeEmote} | Successfully set volume to ${volume}!`)
            .setTimestamp()
    ]})
  }
}