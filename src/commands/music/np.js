const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription("Display the current song playing."),
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
    const progressBar = queue.createProgressBar({
      timecodes: true,
      queue: true,
      length: 25,
      line: "─",
      indicator: "⚬",
    });
    const currentSong = queue.current;

    return await interaction.followUp({
      embeds: [
        new MessageEmbed()
          .setColor("#58ff8d")
          .setAuthor({
            name: "Current Song Playing:",
            iconURL:
              "https://emojis.slackmojis.com/emojis/images/1643517439/34697/jams.gif?1643517439",
          })
          .setThumbnail(currentSong.thumbnail)
          .setTimestamp()
          .setDescription(
            `${queue.playing ? "▶️" : "⏸️"} | [${currentSong.title}](${
              currentSong.url
            })\n\n**${progressBar}**`
          ),
      ],
    });
  },
};
