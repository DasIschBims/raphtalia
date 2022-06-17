const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stops the music and clears the queue."),

  async execute(interaction) {
    await interaction.deferReply();
    const queue = await interaction.client.player.createQueue(
      interaction.guild
    );

    if (!queue || !queue.playing) {
      return await interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setColor("#FF0000")
            .setDescription("❌ | There is currently no music playing!")
            .setTimestamp(),
        ],
        ephemeral: true,
      });
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
            .setDescription(
              "❌ | You have to be in my music channel to do that!"
            )
            .setTimestamp(),
        ],
      });
    }

    queue.clear();
    queue.destroy();

    await interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setColor("#58FF8D")
          .setTitle("✅ | Stopped playing and cleared the queue!")
          .setTimestamp(),
      ],
    });
  },
};
