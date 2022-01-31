const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed, Permissions } = require("discord.js")

module.exports = {
     data: new SlashCommandBuilder()
             .setName("ban")
             .setDescription("Bans an user from the guild")
             .addUserOption(user => user.setName("user").setDescription("Pick a user to ban.").setRequired(true))
             .addStringOption(reason => reason.setName("reason").setDescription("Give a reason why this user will be banned.")),
             
  async execute(interaction) {

    const pickeduser = interaction.options.getMember("user")
    var reason = interaction.options.getString("reason")

    if (reason === null) {
      reason = "No reason specified."
    }

    if (!interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
        {
            interaction.reply({ephemeral: true, embeds: [
              new MessageEmbed()
              .setTitle("You don't have permission to use this command!")
              .setColor("#FF0000")
              .setTimestamp()
            ]})
        }
    } else {
    if (pickeduser.bannable) {
        interaction.reply({ephemeral: true, embeds: [
          new MessageEmbed()
          .setTitle("Ban :hammer:")
          .setColor("#58ff8d")
          .setTimestamp()
          .setDescription(`Successfully banned ${pickeduser}.`)
        ]})

        pickeduser.ban({reason: `${reason} | Banned by ${interaction.member} (${interaction.member.user.username}#${interaction.user.discriminator})`});

      } else {
        interaction.reply({ephemeral: true, embeds: [
          new MessageEmbed()
          .setTitle("This user cannot be banned.")
          .setColor("#FF0000")
          .setTimestamp()
        ]})
      }
    } 
  }
}