const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
     data: new SlashCommandBuilder()
             .setName("userinfo")
             .setDescription("Displays information about specific user.")
             .addUserOption(option => option.setName("user").setDescription("Pick a user.")),
  async execute(interaction) {

    async function getUserBannerUrl(userId) {
        const user = await interaction.client.api.users(userId).get();
        const bannerColor = user.banner_color ? `Banner Color ${user.banner_color}` : "User didn't set a banner color/banner";
        return user.banner ? `[Link (4096x4096)](https://cdn.discordapp.com/banners/${userId}/${user.banner}.png?size=4096)\n[Link (2048x2048)](https://cdn.discordapp.com/banners/${userId}/${user.banner}.png?size=2048)` : `${bannerColor}`;
    }

    async function getUserAvatarUrl(userId) {
      const user = await interaction.client.api.users(userId).get();
      return user.avatar ? `[Link (4096x4096)](https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.png?size=4096)\n[Link (2048x2048)](https://cdn.discordapp.com/banners/${userId}/${user.avatar}.png?size=2048)` : `${bannerColor}`;
  }
    
    async function sendUserEmbed () {
        if (interaction.options.getMember("user") === null) {

            let userbanner = await getUserBannerUrl(interaction.user.id)

            let useravatar = await getUserAvatarUrl(interaction.user.id)
                        
            var selfpickedsusernick = interaction.member.nickname
            
            if (selfpickedsusernick === null) {
                selfpickedsusernick = "None"
            }

            return interaction.reply({embeds: [
                new MessageEmbed()
                .setAuthor({name: `${interaction.user.username}#${interaction.user.discriminator}`, iconURL: interaction.user.avatarURL()})
                .setColor("#58ff8d")
                .setThumbnail(interaction.user.avatarURL({dynamic: true}))
                .setTimestamp()
                .addFields([
                  {
                    name: "**ID**",
                    value: `${interaction.user.id}`,
                    inline: true
                  },
                  {
                    name: "**Mention**",
                    value: `${interaction.member.toString()}`,
                    inline: true
                  },
                  {
                    name: "**Roles**",
                    value: `${interaction.member.roles.cache.map(role => role.toString()).join(", ")}`,
                    inline: true
                  },
                  {
                    name: "**Nickname**",
                    value: `${selfpickedsusernick}`,
                    inline: true
                  },
                  {
                    name: "**Created**",
                    value: `<t:${Math.round(interaction.user.createdTimestamp/1000)}:D>`,
                    inline: true
                  },
                  {
                    name: "**Joined Server**",
                    value: `<t:${Math.round(interaction.member.joinedTimestamp/1000)}:D>`,
                    inline: true
                  },
                  {
                    name: "**Avatar**",
                    value: `${useravatar}`,
                    inline: true
                  },
                  {
                    name: "**Banner**",
                    value: `${userbanner}`,
                    inline: true
                  }
                ])
            ]})
        } else {
            let user = interaction.options.getMember("user")

            let userbanner = await getUserBannerUrl(interaction.options.getMember("user").id)
            
            let useravatar = await getUserAvatarUrl(interaction.options.getMember("user").id)
            
            var selfpickedsusernick = user.nickname
            
            if (selfpickedsusernick === null) {
                selfpickedsusernick = "None"
            }

            return interaction.reply({embeds: [
                new MessageEmbed()
                .setAuthor({name: `${user.user.username}#${user.user.discriminator}`, iconURL: user.user.avatarURL()})
                .setColor("#58ff8d")
                .setThumbnail(user.user.avatarURL({dynamic: true}))
                .setTimestamp()
                .addFields([
                  {
                    name: "**ID**",
                    value: `${user.id}`,
                    inline: true
                  },
                  {
                    name: "**Mention**",
                    value: `${user.toString()}`,
                    inline: true
                  },
                  {
                    name: "**Roles**",
                    value: `${user.roles.cache.map(role => role.toString()).join(", ")}`,
                    inline: true
                  },
                  {
                    name: "**Nickname**",
                    value: `${selfpickedsusernick}`,
                    inline: true
                  },
                  {
                    name: "**Created**",
                    value: `<t:${Math.round(user.user.createdTimestamp/1000)}:D>`,
                    inline: true
                  },
                  {
                    name: "**Joined Server**",
                    value: `<t:${Math.round(user.joinedTimestamp/1000)}:D>`,
                    inline: true
                  },
                  {
                    name: "**Avatar**",
                    value: `${useravatar}`,
                    inline: true
                  },
                  {
                    name: "**Banner**",
                    value: `${userbanner}`,
                    inline: true
                  }
                ])
            ]})
        }
    }
    sendUserEmbed();
  }
}