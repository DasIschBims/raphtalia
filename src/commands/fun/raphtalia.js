const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const raphtalia = require("../../raphtalia-images.js")

module.exports = {
     data: new SlashCommandBuilder()
             .setName("raphtalia")
             .setDescription("Sends random Raphtalia image or gif"),
  async execute(interaction) {
    await interaction.deferReply()
    const randomimg = raphtalia[Math.floor(Math.random() * raphtalia.length)]

         interaction.editReply({embeds: [
           new MessageEmbed()
           .setTitle("Here you go! (っ^_^)っ")
           .setColor("#58ff8d")
           .setImage(randomimg)
           .setDescription(`[Image/Gif source](${randomimg})`)
           .setTimestamp()
         ]})
    }
}