const { MessageEmbed } = require('discord.js')
const phishing = require('stop-discord-phishing')

module.exports = {
    name: "messageCreate",
    execute(message) {
        const phishingCheck = message.content

        function reply () {
            message.reply({embeds: [
                new MessageEmbed()
                .setTitle("Suspicious link detected!")
                .setColor("#FF0000")
                .setTimestamp()
                .addFields([
                    {
                        name: "Information =>",
                        value: `Link sent by: ${message.author}, ${message.author.username}#${message.author.discriminator} (${message.author.id})\nMessage Id: ${message.id}`
                    }
                ])
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