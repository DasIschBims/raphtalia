const { SlashCommandBuilder } = require("@discordjs/builders");
const { appId } = require("../../config.json");
const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kicks an user from the guild")
    .addUserOption((user) =>
      user
        .setName("user")
        .setDescription("Pick a user to kick.")
        .setRequired(true)
    )
    .addStringOption((reason) =>
      reason
        .setName("reason")
        .setDescription("Give a reason why this user will be kicked.")
    ),

  async execute(interaction) {
    const pickeduser = interaction.options.getMember("user");
    const reason = interaction.options.getString("reason");

    if (interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
      if (pickeduser.kickable) {
        interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setTitle("Kick :boot:")
              .setColor("#58ff8d")
              .setTimestamp()
              .setDescription(`Successfully kicked ${pickeduser}.`),
          ],
        });

        pickeduser.kick(reason);
      } else {
        if (
          !interaction.guild.members.cache
            .get(appId)
            .permissions.has(Permissions.FLAGS.KICK_MEMBERS)
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
        interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setTitle("This user cannot be kicked.")
              .setColor("#FF0000")
              .setTimestamp(),
          ],
        });
      }
    } else {
      interaction.reply({
        ephemeral: true,
        embeds: [
          new MessageEmbed()
            .setTitle("You don't have permission to use this command!")
            .setColor("#FF0000")
            .setTimestamp(),
        ],
      });
    }
  },
};
