const DiscordJS = require("discord.js")
const { Collection } = require("discord.js")
const { token } = require("./config.json")
const fs = require("fs")

// Sets intents for the bot
const { Intents } = DiscordJS;
const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

// Creates new collection for the commands
client.commands = new DiscordJS.Collection();

// Reads the command folder
const cmdFolders = fs.readdirSync('./src/commands');
for (const folder of cmdFolders) {
    // Filters out all the commands ending with ".js" after reading all the subfolders
	const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
        // Grabs all the command ".js" files
		const command = require(`./commands/${folder}/${file}`);
        // Sets the commands for the bot
		client.commands.set(command.data.name, command);
        console.log(`Successfully loaded ${file}`);
        // Removes the cached commands
        delete require.cache[require.resolve(`./commands/${folder}/${file}`)];
	}
};

// Almost the same as above, too lazy to write comments -.-
const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)

    var state = 0

    setInterval(() => {
        // Creates an array with below activies
        const activitylist = [
            {  type: "WATCHING", message: `${client.guilds.cache.size} servers`},
            {  type: "PLAYING", message: "with code."},
        ]
        // Adds 1 to "state" to get new activity
        state = (state + 1) % activitylist.length;
	    const activity = activitylist[state];

    // Sets the activity fot the bot
	client.user.setActivity(activity.message, { type: activity.type })
    state + 1

    }, 8000);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return

    const command = client.commands.get(interaction.commandName)

    if (!command) return

    try {
        await command.execute(interaction)
    } catch (error) {
        console.error(error)
        await interaction.reply({ content: `An error occured while attemting to run /${interaction.commandName}.\nPlease try again, if this doesn't work try contacting DasIschBims#1248 via the [Support Server](https://discord.gg/ZURcscg)`, ephemeral: true})
    }
});

client.login(token);