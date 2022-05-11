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
            .setDescription("❌ | There is currently no music playing!")
            .setTimestamp()
          ], ephemeral: true})
          return
    }

    const page = (interaction.options.getNumber("page") || 1) - 1
    const totalpages = Math.ceil(queue.tracks.length / 10)

    if (totalpages === 0) {
      if (page > totalpages) {
        console.log(page, " | ",totalpages)
        interaction.editReply({embeds: [
            new MessageEmbed()
            .setColor("#FF0000")
            .setDescription("❌ | That page does not exist!")
            .setTimestamp()
          ], ephemeral: true})
          return
    }
  }

    var queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
        return `${page * 10 + i + 1}. \`[${song.duration}]\` ${song.title} | <@${song.requestedBy.id}>`
    }).join("\n")

    if (queueString === "") {
      queueString = "The queue is currently empty! Try adding some music with /play."
    }

    const currentSong = queue.current

    if (totalpages === 0) {
      var pagecount = ""
    } else {
      var pagecount = `Page ${page + 1 + "/" + totalpages}`
    }

    if (totalpages > 0) {
      var queuetext = `\n\n**Queue (${queue.tracks.length}):**\n${queueString}`
    } else {
      var queuetext = `\n\n${queueString}`
    }

    interaction.editReply({ embeds: [
        new MessageEmbed()
        .setColor("#58ff8d")
        .setDescription("**🎶 | Currently Playing\n" + (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} | <@${currentSong.requestedBy.id}>**` : "**None**") + queuetext)
        .setThumbnail(currentSong.thumbnail)
        .setFooter({text: `${pagecount}`})
        .setTimestamp()
      ]})
  }
}