const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const phishing = require('stop-discord-phishing')

module.exports = {
    name: "messageCreate",
    execute(message) {
        const phishingCheck = message.content

        function reply () {
            message.reply({embeds: [
                new MessageEmbed()
                .setTitle(":warning: Suspicious link detected! :warning:")
                .setColor("#FF0000")
                .setTimestamp()
                .addFields([
                    {
                        name: "Information =>",
                        value: `${message.author} (${message.author.username}#${message.author.discriminator}) sent a link that is most likely a phishing link.\n` + "``" + "If you happen to feel unsafe learn how to protect yourself via the button below." + "``"
                    },
                    {
                        name: "Author =>",
                        value: "```ini\n" + `[ ${message.author.username}#${message.author.discriminator} (${message.author.id}) ]` + "```"
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
                reply()
            }
        }

        checkMessage(phishingCheck)
    }
}