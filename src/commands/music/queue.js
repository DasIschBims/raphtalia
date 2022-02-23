const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
     data: new SlashCommandBuilder()
             .setName("queue")
             .setDescription("Display the current queue")
             .addNumberOption(number => number.setName("page").setDescription("Enter a page number.").setMinValue(1)),

  async execute(interaction) {
    await interaction.deferReply()
    const queue = interaction.client.player.getQueue(interaction.guild)
    if (!queue || !queue.playing) {
        interaction.editReply({embeds: [
            new MessageEmbed()
            .setColor("#FF0000")
            .setDescription("There are currently no songs in the queue!")
            .setTimestamp()
          ], ephemeral: true})
          return
    }

    const totalPages = queue.tracks.lenght
    const page = (interaction.options.getNumber("page") || 1) - 1

    var queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
        return `${page * 10 + i + 1}. \`[${song.duration}]\` ${song.title} | <@${song.requestedBy.id}>`
    }).join("\n")

    if (queueString === "") {
      queueString = "Such empty ┬─┬ ノ( ゜-゜ノ)"
    }

    const currentSong = queue.current

    interaction.editReply({embeds: [
        new MessageEmbed()
        .setColor("#58ff8d")
        .setDescription("**Currently Playing\n" + (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} | <@${currentSong.requestedBy.id}>` : "None") + `\n\n**Queue:\n${queueString}`)
        .setThumbnail(currentSong.thumbnail)
        .setFooter({text: `Page ${page + 1}/${totalPages + 1}`})
        .setTimestamp()
      ]})
  }
}