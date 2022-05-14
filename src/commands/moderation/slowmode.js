const { SlashCommandBuilder } = require("@discordjs/builders");
const { appId } = require("../../config.json");
const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Set channel slowmode or remove it.")
    .addNumberOption((set) =>
      set
        .setName("time")
        .setDescription(
          "Enter slowmode time (in seconds), max is 21600 seconds (6 hours). Enter 0 to remove slowmode."
        )
        .setRequired(true)
    )
    .addChannelOption((channel) =>
      channel
        .setName("channel")
        .setDescription("Pick a channel to set slowmode for.")
        .setRequired(true)
    ),
  execute(interaction) {
    var time = interaction.options.getNumber("time");

    if (time > 21600) {
      interaction.reply({
        ephemeral: true,
        embeds: [
          new MessageEmbed()
            .setTitle("Please enter a valid time (from 1 to 21600 seconds)!")
            .setColor("#FF0000")
            .setTimestamp(),
        ],
      });
      return 0;
    }

    var pickedchannel = interaction.options.getChannel("channel");

    var channeltype = pickedchannel.type;

    if (
      !interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)
    ) {
      interaction.reply({
        ephemeral: true,
        embeds: [
          new MessageEmbed()
            .setTitle("You don't have permission to use this command!")
            .setColor("#FF0000")
            .setTimestamp(),
        ],
      });
    } else {
      if (
        !interaction.guild.members.cache
          .get(appId)
          .permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)
      ) {
        {
          interaction.reply({
            ephemeral: true,
            embeds: [
              new MessageEmbed()
                .setTitle("I don't have permission to do that!")
                .setColor("#FF0000")
                .setTimestamp(),
            ],
          });
        }
        return 0;
      }
      if (channeltype === "GUILD_TEXT" || "GUILD_THREAD") {
        if (time === 0) {
          pickedchannel.setRateLimitPerUser(0);
          interaction.reply({
            ephemeral: true,
            embeds: [
              new MessageEmbed()
                .setTitle(
                  `Successfully removed slowmode for #${pickedchannel.name}! :arrows_clockwise:`
                )
                .setColor("#58ff8d")
                .setTimestamp(),
            ],
          });
        } else {
          pickedchannel.setRateLimitPerUser(time);
          interaction.reply({
            ephemeral: true,
            embeds: [
              new MessageEmbed()
                .setTitle(
                  `Successfully set slowmode to ${time} seconds for #${pickedchannel.name}! :stopwatch:`
                )
                .setColor("#58ff8d")
                .setTimestamp(),
            ],
          });
        }
      } else {
        interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setTitle(`Please select a text channel or a thread!`)
              .setColor("#FF0000")
              .setTimestamp(),
          ],
        });
      }
    }
  },
};
