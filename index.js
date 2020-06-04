const Discord = require("discord.js");
const Enmap = require("enmap");
const fs = require("fs");
const {Spiget} = require("spiget");
const spiget = new Spiget("Darrion's Plugin Bot");

/**
 * Set up ALL THE THINGS
 */
const client = {
    bot: new Discord.Client,
    commands: new Enmap(),
    aliases: new Enmap(),
    cooldowns: new Enmap(),
    config: require("./config.json"),
    logger: require("./util/logger.js")
};

const { prefix, token } = require("./config.json");

client.logger.log("Starting up...");

/**
 * Load all ".js" files in ./events and listen for emits
 */
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));

for (const eventFile of eventFiles) {
    const event = require(`./events/${eventFile}`);

    client.bot.on(event.name, (...args) => event.execute(client, ...args));
}

client.logger.log(`Loaded ${eventFiles.length} events`);

/**
 * Load all ".js" files in ./commands and add to client.commands Enmap
 * Also check the file for assigned aliases and add to client.aliases Enmap
 */
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const commandFile of commandFiles) {
    const command = require(`./commands/${commandFile}`);
    client.commands.set(command.name, command);

    if (command.aliases && command.aliases.length > 0) {
        for (const alias of command.aliases) {
            client.aliases.set(alias, command.name);
        }
    }
}



/*
    Checks for updates every 15 minutes
    3600s = 1h
    900s = 15m
    15m = 900 * 1000 ms;
*/

setInterval(checkUpdates, 900 * 1000);
let resourceIDs = ["72678", "69279"];

function checkUpdates() {
    // Open a new connection, using the GET request on the URL endpoint
    for (let id of resourceIDs){
        spiget.getResource(id).then(resource => {
            console.log(resource.name);
        });
    }
}

client.logger.log(`Registered ${commandFiles.length} commands`);

client.logger.log("Logging in...");
client.bot.login(client.config.token);