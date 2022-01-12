const DiscordJS = require("discord.js");
const { Collection } = require("discord.js");
const { token, appId } = require("./config.json");
const fs = require("fs");

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
const commandFolders = fs.readdirSync('./src/commands');
for (const folder of commandFolders) {
    // Filters out all the commands ending with ".js" after reading all the subfolders
	const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
        // Grabs all the command ".js" files
		const command = require(`./commands/${folder}/${file}`);
        // Sets the commands for the bot
		client.commands.set(command.name, command);
	}
};

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

    // Sets "state" to "0" if it reached "100"
    if (state = 100) {
        state = 0
    }

    }, 8000);
});

client.login(token);