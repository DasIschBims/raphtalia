const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const { kawaiiRedToken } = require("../../config.json")
const fetch = require('cross-fetch');

module.exports = {
     data: new SlashCommandBuilder()
             .setName("shrug")
             .setDescription("Shrug moment."),
  async execute(interaction) {
    const apiLink = `https://kawaii.red/api/gif/shrug/token=${kawaiiRedToken}/`

    fetch(apiLink).then(res => {
      if (res.status >= 400) {
        throw new Error("Bad response from server");
      }
      return res.json();
    })
    .then(apiResponse => {
      interaction.reply({embeds: [
        new MessageEmbed()
        .setTitle(`${interaction.user.username} shrugs`)
        .setColor("#58ff8d")
        .setImage(`${apiResponse.response}`)
        .setFooter({text: "Gifs from kawaii.red"})
        .setTimestamp()
      ]})
    })
    .catch(err => {
      console.error(err);
    });
    }
}