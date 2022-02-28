const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const playdl = require("play-dl");
const { QueryType } = require("discord-player")

module.exports = {
     data: new SlashCommandBuilder()
             .setName("play")
             .setDescription("Play a song of your liking in a Voice Channel.")
             .addStringOption(query => query.setName("query").setDescription("Enter a keywory or url.").setRequired(true)),

  async execute(interaction, client) {
    await interaction.deferReply()

    if (!interaction.member.voice.channelId) {
      return await interaction.followUp({ embeds: [
        new MessageEmbed()
        .setDescription("❌ | Please join a voice channel to play music!")
        .setColor("FF0000")
      ]})
    }

    if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
      return await interaction.followUp({ embeds: [
        new MessageEmbed()
        .setDescription("❌ | You have to be in my voice channel!")
        .setColor("FF0000")
      ]})
    }

    const songQuery = interaction.options.getString("query")
    const searchQuery = await interaction.client.player.search(songQuery, {
      requestedBy: interaction.user,
      searchEngine: QueryType.AUTO
    })

    let queue = await interaction.client.player.createQueue(interaction.guild, {
      initialVolume: 80,
      leaveOnEmptyCooldown: 120000,
      leaveOnEmpty: true,
      bufferTimeout: 200,
      async onBeforeCreateStream(track, source, _queue) {
        if (source === "soundcloud") {
          const client_id = await playdl.getFreeClientID();
          playdl.setToken({
            soundcloud: {
              client_id: client_id,
            },
          });
          if (await playdl.so_validate(track.url)) {
            let soundCloudInfo = await playdl.soundcloud(track.url);
            return (await playdl.stream_from_info(soundCloudInfo)).stream;
          }
          return;
        }

        if (source === "youtube") {
          const validateSP = playdl.sp_validate(track.url);
          const spotifyList = ["track", "album", "playlist"];
          if (spotifyList.includes(validateSP)) {
            if (playdl.is_expired()) {
              await playdl.refreshToken();
            }
            let spotifyInfo = await playdl.spotify(track.url);
            let youtube = await playdl.search(`${spotifyInfo.name}`, {
              limit: 2,
            });
            return (
              await playdl.stream(youtube[0].url, {
                discordPlayerCompatibility: true,
                quality: 1,
              })
            ).stream;
          }

          return (
            await playdl.stream(track.url, {
              discordPlayerCompatibility: true,
              quality: 1,
            })
          ).stream;
        }
      }
    })

    try {
      if (!queue.connection) {
        await queue.connect(interaction.member.voice.channel)
      }
    } catch {
      client.player.deleteQueue(interaction.guild);
      queue.destroy(true)
      return await interaction.followUp({ embeds: [
        new MessageEmbed()
        .setDescription("❌ | Couldn't join your voice channel.")
        .setColor("FF0000")
      ], empheral: true})
    }

    searchQuery.playlist
      ? queue.addTracks(searchQuery.tracks)
      : queue.addTrack(searchQuery.tracks[0]);

    if (!queue.playling) {
        await queue.play();
        searchQuery.playlist
          ? await interaction.followUp({
            embeds: [
              new MessageEmbed()
              .setColor("#58FF8D")
              .setDescription(`✅ | Queued ${queue.tracks.length} Songs`),

              new MessageEmbed()
              .setColor("#58FF8D")
              .setTitle(`${queue.playling ? "✅ Added to queue" : "🎶 Playing"}`)
              .setAuthor({name: `${interaction.user.username}`, iconURL: `${interaction.user.avatarURL() || client.user.avatarURL()}`})
              .setDescription(`Song: **[${searchQuery.tracks[0].title}](${searchQuery.tracks[0].url})**`)
              .setThumbnail(searchQuery.tracks[0].thumbnail)
              .setTimestamp()
              .addFields(
                {
                  name: "Author",
                  value: `${searchQuery.tracks[0].author}`,
                  inline: true
                },
                {
                  name: "Duration",
                  value: `${searchQuery.tracks[0].duration}`,
                  inline: true
                }
              )]
          })
          : await interaction.followUp({
            embeds: [
              new MessageEmbed()
              .setColor("#58FF8D")
              .setDescription(`✅ | Queued ${queue.tracks.length} Songs`)
            ]
          })
          return
    }

    if (queue.playing) {
      searchQuery.playlist
        ? await interaction.followUp({ embeds: [playlistEmbed, musicEmbed]})
        : await interaction.followUp({ embeds: [musicEmbed]})
        return
    }
   }
}