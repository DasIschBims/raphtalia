const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Displays information about the guild."),
  async execute(interaction) {
    var afkchannel = interaction.guild.afkChannelId;

    if (afkchannel === null) {
      afkchannel = "None";
    } else {
      afkchannel = `<#${interaction.guild.afkChannelId}>`;
    }

    var boostlevel = interaction.guild.premiumTier;

    if (boostlevel === "NONE") {
      boostlevel = "None";
    }

    var guilddescription = interaction.guild.description;

    if (guilddescription === null) {
      guilddescription = "None";
    }

    var rulechannel = interaction.guild.rulesChannelId;

    if (rulechannel === null) {
      rulechannel = "None";
    } else {
      rulechannel = `<#${interaction.guild.rulesChannelId}>`;
    }

    var updateschannel = interaction.guild.publicUpdatesChannelId;

    if (updateschannel === null) {
      updateschannel = "None";
    } else {
      updateschannel = `<#${interaction.guild.publicUpdatesChannelId}>`;
    }

    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle("Serverinfo")
          .setColor("#58ff8d")
          .setThumbnail(`${interaction.guild.iconURL({ dynamic: true })}`)
          .setTimestamp()
          .addFields([
            {
              name: "<:pin:658538493202530336> | General Information",
              value: `> Name: **${interaction.guild.name}**
                            > ID: **${interaction.guild.id}**
                            > Owner: **<@${interaction.guild.ownerId}>**
                            > Total Members: **${
                              interaction.guild.memberCount
                            }**
                            > Creation date: <t:${Math.round(
                              interaction.guild.createdTimestamp / 1000
                            )}>
                            > Description: **${guilddescription}**`,
            },
            {
              name: " <:booster4:585764446178246657> | Boost Status",
              value: `> Boost Level: **${boostlevel}**
                            > Boosts: **${interaction.guild.premiumSubscriptionCount}**`,
            },
            {
              name: "<:role:808826577785716756> | Roles",
              value: `> Roles: **${interaction.guild.roles.cache.size}**`,
            },
            {
              name: "<:channel:585783907841212418> | Channels",
              value: `> Total Channels: **${
                interaction.guild.channels.cache.size
              }**
                            > Text Channels: **${
                              interaction.guild.channels.cache.filter(
                                (c) => c.type === "GUILD_TEXT"
                              ).size
                            }**
                            > Voice Channels: **${
                              interaction.guild.channels.cache.filter(
                                (c) => c.type === "GUILD_VOICE"
                              ).size
                            }**
                            > Total Categories: **${
                              interaction.guild.channels.cache.filter(
                                (c) => c.type === "GUILD_CATEGORY"
                              ).size
                            }**
                            > AFK Channel: **${afkchannel}**
                            > Rule Channel: **${rulechannel}**
                            > Updates Channel : **${updateschannel}**`,
            },
            {
              name: "<:emoji_ghost:658538492321595393> | Emotes",
              value: `> Emotes: **${interaction.guild.emojis.cache.size}**`,
            },
          ]),
      ],
    });
  },
};
