const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
     data: new SlashCommandBuilder()
             .setName("kick")
             .setDescription("Kicks an user from the guild"),
             
  async execute(interaction) {
         interaction.reply({ephemeral: true, embeds: [
           new MessageEmbed()
           .setTitle("Help")
           .setColor("5832589")
           .setImage("https://media.discordapp.net/attachments/898953752478908466/907744410031226920/line.png?width=360&height=2")
           .setTimestamp()
           .addFields([
             {
               name: "Kick :boot:",
               value: `<@${user}`,
               inline: true
             }
           ])
         ]})
    }
  }