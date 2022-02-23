const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const { kawaiiRedToken } = require("../../config.json")
const fetch = require('cross-fetch');

module.exports = {
     data: new SlashCommandBuilder()
             .setName("hug")
             .setDescription("Hugs a person.")
             .addUserOption(user => user.setName("user").setDescription("Pick a user to hug.").setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply()
    const pickeduser = interaction.options.getMember("user").user.username

    const apiLink = `https://kawaii.red/api/gif/hug/token=${kawaiiRedToken}/`

    fetch(apiLink).then(res => {
      if (res.status >= 400) {
        throw new Error("Bad response from server");
      }
      return res.json();
    })
    .then(apiResponse => {
      interaction.editReply({embeds: [
        new MessageEmbed()
        .setTitle(`${interaction.user.username} hugs ${pickeduser}`)
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