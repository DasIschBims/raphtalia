const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const phishing = require('stop-discord-phishing')

module.exports = {
    name: "messageCreate",
    execute(message) {
        const phishingCheck = message.content

        function reply () {
            message.reply({embeds: [
                new MessageEmbed()
                .setTitle(":x: Suspicious link detected!")
                .setColor("#FF0000")
                .setTimestamp()
                .setDescription(`${message.author} sent a link that is most likely a phishing link.`)
                .addFields([
                    {
                        name: "Author =>",
                        value: "```diff\n" + `- ${message.author.username}#${message.author.discriminator}\n- ${message.author.id}` + "```"
                    },
                    {
                        name: "Tip =>",
                        value: "*If you happen to feel unsafe learn how to stay safe via the button below.*"
                    }
                ])
            ], components: [
                new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setLabel("Account Security")
                    .setStyle("LINK")
                    .setURL("https://discord.com/safety/360043857751-Four-steps-to-a-super-safe-account")
                )
            ]})
        }

        async function checkMessage (message) {
            let isPhishing = await phishing.checkMessage(phishingCheck)

            if (isPhishing === true) {
                if (message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
                    reply()
                } else { return }
            }
        }

        checkMessage(phishingCheck)
    }
}