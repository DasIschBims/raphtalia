const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const { kawaiiRedToken } = require("../../config.json")
const fetch = require('cross-fetch');

module.exports = {
     data: new SlashCommandBuilder()
             .setName("cuddle")
             .setDescription("Cuddles a person.")
             .addUserOption(user => user.setName("user").setDescription("Pick a user to cuddle.").setRequired(true)),
  async execute(interaction) {

    const pickeduser = interaction.options.getMember("user").user.username

    const apiLink = `https://kawaii.red/api/gif/cuddle/token=${kawaiiRedToken}/`

    fetch(apiLink).then(res => {
      if (res.status >= 400) {
        throw new Error("Bad response from server");
      }
      return res.json();
    })
    .then(apiResponse => {
      interaction.reply({embeds: [
        new MessageEmbed()
        .setTitle(`${interaction.user.username} cuddles ${pickeduser}`)
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