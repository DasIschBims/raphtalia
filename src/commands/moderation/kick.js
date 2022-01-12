const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
     data: new SlashCommandBuilder()
             .setName("kick")
             .setDescription("Kicks an user from the guild")
             .addUserOption(user => user.setName("user").setDescription("Pick a user to kick.").setRequired(true)),
             
  async execute(interaction) {
    
    const pickeduser = interaction.options.getUser("user")

         interaction.reply({ephemeral: true, embeds: [
           new MessageEmbed()
           .setTitle("Help")
           .setColor("5832589")
           .setTimestamp()
           .addFields([
             {
               name: "Kick :boot:",
               value: `Successfully kicked <@${user}>.`,
               inline: true
             }
           ])
         ]})
    }
  }