const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
     data: new SlashCommandBuilder()
             .setName("userinfo")
             .setDescription("Displays information about specific user.")
             .addUserOption(option => option.setName("user").setDescription("Pick a user.")),
  async execute(interaction) {
    
    if (interaction.options.getMember("user") === null) {
      var userbanner = interaction.user.banner
      
      if (userbanner === undefined) {
        userbanner = "None"
      } else {
        userbanner = `[Link!](https://cdn.discordapp.com/banners/${interaction.user.id}/${interaction.user.banner}.png?size=4096)`
      }

      var selfpickedsusernick = interaction.member.nickname

      if (selfpickedsusernick === null) {
        selfpickedsusernick = "None"
      }

        interaction.reply({embeds: [
            new MessageEmbed()
            .setTitle(`${interaction.user.tag}`)
            .setColor("#58ff8d")
            .setThumbnail(interaction.user.avatarURL({dynamic: true}))
            .setTimestamp()
            .addFields([
              {
                name: "<:members:658538493470965787> | General Information",
                value: `> Name: **${interaction.member.user.username}**
                        > Discriminator: **#${interaction.user.discriminator}**
                        > ID: **${interaction.user.id}**
                        > Nickname: **${selfpickedsusernick}**
                        > Creation date: <t:${Math.round(interaction.user.createdTimestamp/1000)}>
                        > Joined Guild: <t:${Math.round(interaction.member.joinedTimestamp/1000)}>
                        > Avatar: **[Link!](${interaction.user.avatarURL({dynamic: true})})**
                        > Banner: **${userbanner}**`
              }
            ])
          ]})
    } else {
        const commandpickeduser = interaction.options.getMember("user")

        const pickeduser = await commandpickeduser.user.fetch(commandpickeduser.id, true)

        console.log(pickeduser)

        var pickeduserbanner = pickeduser.banner

        if (pickeduserbanner === undefined) {
          pickeduserbanner = `${pickeduser.user.bannerURL({dynamic: true})}`
        } else {
          pickeduserbanner = `[Link!](${await pickeduser.bannerURL({dynamic: true})})`
        }

        var pickedsusernick = commandpickeduser.nickname

        if (pickedsusernick === null) {
          pickedsusernick = "None"
        }

        interaction.reply({embeds: [
            new MessageEmbed()
            .setTitle(`${commandpickeduser.user.tag}`)
            .setColor("#58ff8d")
            .setThumbnail(commandpickeduser.user.avatarURL({dynamic: true}))
            .setTimestamp()
            .addFields([
              {
                name: "<:members:658538493470965787> | General Information",
                value: `> Name: **${commandpickeduser.user.username}**
                        > Discriminator: **#${commandpickeduser.user.discriminator}**
                        > ID: **${commandpickeduser.id}**
                        > Nickname: **${pickedsusernick}**
                        > Creation date: <t:${Math.round(commandpickeduser.user.createdTimestamp/1000)}>
                        > Joined Guild: <t:${Math.round(commandpickeduser.joinedTimestamp/1000)}>
                        > Avatar: **[Link!](${commandpickeduser.user.avatarURL({dynamic: true})})**
                        > Banner: **${pickeduserbanner}**`
              }
            ])
          ]})
    }
  }
}