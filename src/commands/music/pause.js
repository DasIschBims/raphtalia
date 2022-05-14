const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pause the current song."),
  async execute(interaction) {
    await interaction.deferReply();
    const queue = interaction.client.player.getQueue(interaction.guild);
    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId !==
        interaction.guild.me.voice.channelId
    ) {
      return await interaction.followUp({
        embeds: [
          new MessageEmbed()
            .setColor("#FF0000")
            .setDescription(
              "❌ | You have to be in my music channel to do that!"
            )
            .setTimestamp(),
        ],
      });
    }

    if (!queue || !queue.playing) {
      return await interaction.followUp({
        embeds: [
          new MessageEmbed()
            .setColor("#FF0000")
            .setDescription("❌ | There is currently no music playing!")
            .setTimestamp(),
        ],
      });
    }

    const currentSong = queue.current;

    queue.setPaused(true);

    return await interaction.followUp({
      embeds: [
        new MessageEmbed()
          .setColor("#00FF00")
          .setThumbnail(currentSong.thumbnail)
          .setTimestamp()
          .setDescription(`⏸️ | Paused **${currentSong.title}**`),
      ],
    });
  },
};
