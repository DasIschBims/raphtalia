const DiscordJS = require("discord.js");
const config = require("./config.json");
const fs = require("fs");
const { Player } = require("discord-player");
const playdl = require("play-dl");

// Sets intents for the bot
const { Intents } = DiscordJS;
const client = new DiscordJS.Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

// Creates new collection for the commands
client.commands = new DiscordJS.Collection();

// Reads the command folder
const cmdFolders = fs.readdirSync("./src/commands");
for (const folder of cmdFolders) {
  // Filters out all the commands ending with ".js" after reading all the subfolders
  const commandFiles = fs
    .readdirSync(`./src/commands/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    // Grabs all the command ".js" files
    const command = require(`./commands/${folder}/${file}`);
    // Sets the commands for the bot
    client.commands.set(command.data.name, command);
    console.log(`Successfully loaded command: ${file}`);
  }
}

// Almost the same as above, too lazy to write comments -.-
const eventFiles = fs
  .readdirSync("./src/events")
  .filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
  console.log(`Successfully loaded event: ${file}`);
}

client.player = new Player(client, {
  volumeSmoothness: 0.1,
  leaveOnEmptyCooldown: 120000,
  leaveOnEmpty: true,
  autoSelfDeaf: true,
  initialVolume: 50,
  bufferingTimeout: 2,
  volumeSmoothness: 0.2,
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25,
    filter: "audioonly",
  },
});

function playdlSetToken() {
  playdl.setToken({
    spotify: {
      client_id: config.spClientId,
      client_secret: config.spClientSecret,
      refresh_token: config.spRefreshToken,
      market: "DE",
    },
  });
}

playdlSetToken();

setInterval(() => {
  if (playdl.is_expired()) {
    console.log("Refreshing token...");
    playdl.refreshToken();
    console.log("Token refreshed!");
  }
}, 10000);

setInterval(() => {
  try {
    if (playdl.is_expired()) {
      console.log("Refreshing token...");
      playdl.refreshToken();
      console.log("Token refreshed!");
    }
  } catch (error) {
    console.log("An error occured while refreshing token!:\n\n" + error);
  }
}, 10000);

client.on("voiceStateUpdate", (event, newstate) => {
  if (event.id === client.user.id) {
    if (newstate.channelId === null) {
      if (
        client.player.getQueue(event.guild) &&
        client.player.getQueue(event.guild).playing
      ) {
        client.player.deleteQueue(event.guild);
        return;
      }
    } else {
      return;
    }
  }
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

  var state = 0;

  setInterval(() => {
    // Creates an array with below activies
    const activitylist = [
      { type: "WATCHING", message: `${client.guilds.cache.size} servers` },
      { type: "PLAYING", message: "with code." },
      { type: "WATCHING", message: "bit.ly/raphtalia-page" },
      { type: "COMPETING", message: "the botlist" },
    ];
    // Adds 1 to "state" to get new activity
    state = (state + 1) % activitylist.length;
    const activity = activitylist[state];

    // Sets the activity fot the bot
    client.user.setActivity(activity.message, { type: activity.type });
    state + 1;
  }, 8000);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.followUp({
      content: `An error occured while attemting to run /${interaction.commandName}.\nPlease try again, if this doesn't work try contacting DasIschBims#1248 via the [Support Server](https://discord.gg/xxWmfUSeDU)`,
      ephemeral: true,
    });
  }
});

client.login(config.token);
