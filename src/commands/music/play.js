const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const { QueryType } = require("discord-player")

module.exports = {
     data: new SlashCommandBuilder()
             .setName("play")
             .setDescription("Play a song of your liking in a Voice Channel.")
             .addStringOption(query => query.setName("query").setDescription("Enter a keywory or url.").setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply()
      if (!interaction.member.voice.channel) {
          return interaction.editReply({embeds: [
            new MessageEmbed()
            .setColor("#FF0000")
            .setTitle(`Please join a voice channel and try again!`)
            .setTimestamp()
          ], ephemeral: true})
      }

      const queue = await interaction.client.player.createQueue(interaction.guild)

      if (!queue.connection) {
        await queue.connect(interaction.member.voice.channel)
      }

      const spTrack = "spotify.com/track/"
      const spPlaylist = "spotify.com/playlist/"

      const ytPlaylist = "list="
      const ytVideo = "watch?v="
      
      let url = interaction.options.getString("query")

      if (url.indexOf(spTrack) > 1) {
         result =  await interaction.client.player.search(url, {
            requestedBy: interaction.user,
            searchEngine: QueryType.SPOTIFY_SONG
        })
      }

      if (url.indexOf(spPlaylist) > 1) {
         result =  await interaction.client.player.search(url, {
            requestedBy: interaction.user,
            searchEngine: QueryType.SPOTIFY_PLAYLIST
        })
      }
      if (url.indexOf(ytPlaylist) > url.indexOf(ytVideo)) {
         result =  await interaction.client.player.search(url, {
          requestedBy: interaction.user,
          searchEngine: QueryType.YOUTUBE_PLAYLIST
      })
      }

      if (url.indexOf(ytVideo) > url.indexOf(ytPlaylist)) {
         result =  await interaction.client.player.search(url, {
          requestedBy: interaction.user,
          searchEngine: QueryType.YOUTUBE_VIDEO
      })
      }

      if (url.indexOf(ytPlaylist) < 1 || url.indexOf(ytVideo) < 1 || url.indexOf(spPlaylist) < 1 || url.indexOf(spTrack) < 1) {
        result =  await interaction.client.player.search(url, {
          requestedBy: interaction.user,
          searchEngine: QueryType.AUTO
      })

      const song = result.tracks[0]
      queue.addTracks(result.tracks)

      await queue.addTrack(song)
      if (!queue.playing) await queue.play()
      interaction.editReply({embeds: [
        new MessageEmbed()
        .setColor("#58ff8d")
        .setTitle(`Successfully added to the queue`)
        .setURL(song.url)
        .setDescription(`**${song.title}**`)
        .setThumbnail(song.thumbnail)
        .setFooter({text: `Duration: ${song.duration}`})
        .setTimestamp()
      ]})

      return;
      } else {
        if (!result.tracks.lenght === 0) {
          return interaction.editReply("Not found.")
      }

      const song = result.tracks[0]
      queue.addTracks(result.tracks)

      if (url.indexOf(ytVideo) > 1 || url.indexOf(spTrack) > 1) {
        await queue.addTrack(song)
        if (!queue.playing) await queue.play()
        interaction.editReply({embeds: [
          new MessageEmbed()
          .setColor("#58ff8d")
          .setTitle(`Successfully added to the queue`)
          .setURL(song.url)
          .setDescription(`**${song.title}**`)
          .setThumbnail(song.thumbnail)
          .setFooter({text: `Duration: ${song.duration}`})
          .setTimestamp()
        ]})
      } else {
        const playlist = result.playlist
        if (!queue.playing) await queue.play()
        await interaction.editReply({embeds: [
          new MessageEmbed()
          .setColor("#58ff8d")
          .setTitle(`Successfully added ${playlist.title} to the queue`)
          .setURL(playlist.url)
          .setDescription(`**${playlist.tracks.lenght} Songs have been added to the queue!**`)
          .setThumbnail(playlist.thumbnail)
          .setTimestamp()
        ]})
      }
      }
   }
}