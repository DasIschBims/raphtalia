const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
     data: new SlashCommandBuilder()
             .setName("flipcoin")
             .setDescription("Flips a coin."),
  execute(interaction) {
      
    const flip = Math.random() * 1000
    const result = Math.round(flip)

    if (result <= 500) {
      interaction.reply({embeds: [
        new MessageEmbed()
        .setColor("#58ff8d")
        .setTimestamp()
        .setTitle("It's head!")
      ]})
    } else {
      interaction.reply({embeds: [
        new MessageEmbed()
        .setColor("#58ff8d")
        .setTimestamp()
        .setTitle("It's tails!")
      ]})
    }
    }
}