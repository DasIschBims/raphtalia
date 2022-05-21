const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const playdl = require("play-dl");
const { QueryType } = require("discord-player");

function urlType(url) {
  var url = url.toLowerCase();
  if (
    url.split("/")[2] === "www.youtube.com" ||
    url.split("/")[2] === "youtube.com" ||
    url.split("/")[2] === "youtu.be" ||
    url.split("/")[2] === "www.youtu.be"
  ) {
    var urlSplit = url.split("/")[3];
    var url = urlSplit.split("?")[0];
    return url;
  }

  switch (url.split("/")[3]) {
    case "playlist":
      return "playlist";
    case "watch":
      return "video";
    default:
      return "invalid";
  }
}

async function sleep(t) {
  setTimeout(() => {}, t);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song of your liking in a Voice Channel.")
    .addStringOption((query) =>
      query
        .setName("query")
        .setDescription("Enter a keywory or url.")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();
    const query = interaction.options.getString("query");
    const guildQueue = interaction.client.player.getQueue(interaction.guild.id);
    const channel = interaction.member?.voice?.channel;

    if (!channel) {
      return await interaction.followUp({
        embeds: [
          new MessageEmbed()
            .setDescription("❌ | Please join a voice channel to play music!")
            .setColor("FF0000"),
        ],
      });
    }

    if (guildQueue) {
      if (channel.id !== interaction.guild.me?.voice?.channelId) {
        return await interaction.followUp({
          embeds: [
            new MessageEmbed()
              .setDescription(
                "❌ | Please join the same voice channel to play music!"
              )
              .setColor("FF0000"),
          ],
        });
      }
    } else {
      if (!channel.viewable)
        return interaction.followUp({
          embeds: [
            new MessageEmbed()
              .setDescription(
                "❌ | I need **`VIEW_CHANNEL`** permission to view your channel."
              )
              .setColor("FF0000"),
          ],
        });
      if (!channel.joinable)
        return interaction.followUp({
          embeds: [
            new MessageEmbed()
              .setDescription(
                "❌ | I need **`CONNECT_CHANNEL`** permission to connect to your channel."
              )
              .setColor("FF0000"),
          ],
        });
      if (!channel.speakable)
        return interaction.followUp({
          embeds: [
            new MessageEmbed()
              .setDescription(
                "❌ | I need **`SPEAK`** permission to speak in your channel."
              )
              .setColor("FF0000"),
          ],
        });
      if (channel.full)
        return interaction.followUp({
          embeds: [
            new MessageEmbed()
              .setDescription("❌ | I Can't join, the voice channel is full.")
              .setColor("FF0000"),
          ],
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
            .setDescription(
              "❌ | You have to join the voice channel I'm in to use that command!"
            )
            .setColor("FF0000"),
        ],
      });
    }

    let result;
    let url = query;
    switch (urlType(url)) {
      case "playlist":
        result = await interaction.client.player.search(url, {
          requestedBy: interaction.member.id,
          QueryType: QueryType.YOUTUBE_PLAYLIST,
        });
        break;
      case "watch":
        result = await interaction.client.player.search(url, {
          requestedBy: interaction.member.id,
          QueryType: QueryType.YOUTUBE_VIDEO,
        });
        break;
      case "invalid":
        result = await interaction.client.player.search(url, {
          requestedBy: interaction.member.id,
          QueryType: QueryType.YOUTUBE_SEARCH,
        });
    }
    await interaction.followUp({
      embeds: [
        new MessageEmbed()
          .setColor("#FF88FF")
          .setDescription("🔎 | Searching..."),
      ],
    });

    if (!result || !result.tracks.length) {
      return await interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setDescription("❌ | I couldn't find any results!")
            .setColor("FF0000"),
        ],
      });
    }

    let queue;
    if (guildQueue) {
      queue = guildQueue;
    } else {
      queue = await interaction.client.player.createQueue(interaction.guild, {
        async onBeforeCreateStream(track, source, _queue) {
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
        },
      });
    }

    try {
      if (!queue.connection) await queue.connect(channel);
    } catch (error) {
      queue.destroy(true);
      console.log(error);
    }

    result.playlist
      ? queue.addTracks(result.tracks)
      : queue.addTrack(result.tracks[0]);

    if (!queue.playling) {
      await interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setColor("#58ff8d")
            .setDescription(`⬇️ | Downloading...`),
        ],
      });
      await sleep(3000);
      if (!queue.playing) {
        await queue.play();
      }
    }

    switch (urlType(url)) {
      case "playlist":
        await interaction.editReply({
          embeds: [
            new MessageEmbed()
              .setColor("#58ff8d")
              .setDescription(
                `🎵 | Added playlist \`${result.playlist.title}\` to the queue!`
              ),
          ],
        });
        break;
      case "watch":
        await interaction.editReply({
          embeds: [
            new MessageEmbed()
              .setColor("#58ff8d")
              .setDescription(
                `🎵 | Added \`${result.tracks[0].title}\` to the queue!`
              ),
          ],
        });
        break;
      case "invalid":
        await interaction.editReply({
          embeds: [
            new MessageEmbed()
              .setColor("#58ff8d")
              .setDescription(
                `🎵 | Added \`${result.tracks[0].title}\` to the queue!`
              ),
          ],
        });
    }
  },
};
