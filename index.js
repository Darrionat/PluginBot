const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

const Enmap = require("enmap");
const fs = require("fs");
const { Spiget } = require("spiget");
const spiget = new Spiget("Darrion's Plugin Bot");

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var request = new XMLHttpRequest();
/**
 * Set up ALL THE THINGS
 */
const client = {
    bot: new Discord.Client,
    commands: new Enmap(),
    aliases: new Enmap(),
    cooldowns: new Enmap(),
    config: require("./config.json"),
    logger: require("./util/logger.js"),
    package: require("./package.json")
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
    Checks for updates every 1 minute
    1m = 60 * 1000 ms;
*/
setInterval(checkUpdates, 60 * 1000);


async function checkUpdates() {
    try {
        var serverDataDir = fs.readdirSync("./serverdata");
    } catch (error) {
        client.logger.log("No ./serverdata directory", "wrn");
        return;
    }
    const serverFiles = serverDataDir.filter(file => file.endsWith(".json"));

    for (const serverFile of serverFiles) {
        const filePath = `./serverdata/${serverFile}`;
        let jsonExistingData = JSON.parse(getJSONFileData(filePath));

        for (let watchedResource of jsonExistingData.watchedResources) {
            const updateEmbed = new MessageEmbed();
            const id = watchedResource.resourceID;
            const channel = client.bot.channels.cache.get(watchedResource.channelID);

            const resource = await spiget.getResource(id).catch((error) => {
                return;
            });
            if (resource == undefined) {
                
            }
            const author = (await resource.getAuthor()).name;
            let image = resource.icon.fullUrl();
            image = image.replace("orgdata", "org/data");

            let sent = false;
            request.onreadystatechange = function () {
                if (sent) return;
                const latestVersion = request.responseText;
                if (latestVersion.length > 16) {
                    return;
                }
                if (watchedResource.lastCheckedVersion == latestVersion) {
                    // Up to date
                    return;
                }
                if (latestVersion == "") {
                    return;
                }
                // Not up to date. Post to channel
                updateEmbed
                    .setAuthor(`Author: ${author}`, `${image}`)
                    .setColor(channel.guild.me.displayHexColor)
                    .setTitle(`An update for ${resource.name} is available`)
                    .setDescription(`${resource.tag}`)
                    .addFields(
                        { name: 'Version', value: `${latestVersion}`, inline: false },
                        { name: 'Download', value: `https://spigotmc.org/resources/.${id}/`, inline: false }
                    )
                sent = true;
                console.log(latestVersion)
                console.log(watchedResource.lastCheckedVersion);
                watchedResource.lastCheckedVersion = latestVersion;
                fs.writeFile(filePath, JSON.stringify(jsonExistingData), err => {
                    if (err) throw err;
                });
                client.bot.channels.cache.get(watchedResource.channelID).send({ embed: updateEmbed });
            };
            request.open("GET", `https://api.spigotmc.org/legacy/update.php?resource=${id}`, true);
            request.send();
            continue;
        }
    }
}

function getJSONFileData(filePath) {
    return fs.readFileSync(filePath, (err, data) => {
        if (err) return;
        return JSON.parse(data);
    });
}

client.logger.log(`Registered ${commandFiles.length} commands`);

client.logger.log("Logging in...");
client.bot.login(client.config.token);