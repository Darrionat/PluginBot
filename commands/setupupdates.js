const fs = require("fs");
const updatechecker = "./updatechecker";
const { Spiget } = require("spiget");
const spiget = new Spiget("Darrion's Plugin Bot");

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var request = new XMLHttpRequest();

module.exports = {
    name: "setupupdates",
    description: "Sets up a listener to post updates of a plugin in a defined channel",
    aliases: [],
    guild: ["all"],
    nsfw: false,
    user_permissions: ["ADMINISTRATOR"],
    bot_permissions: [],
    args_required: 2,
    args_usage: `[resource_id] [channel] Example: p!setupupdates 72678 #announcements`,
    cooldown: 5,

    // setupupdates 12345 channel
    async execute(client, message, args) {
        try {
            var resource = await spiget.getResource(args[0]);
        } catch{
            message.reply(`uh oh ${args[0]} is not a valid resource id!`)
            return;
        }

        var channel = message.mentions.channels.first();
        if (channel === undefined) {
            return message.reply("that channel is undefined. Try mentioning a channel in this server");
        }
        var channelInServer = message.guild.channels.cache.has(channel.id);
        if (!channelInServer) {
            return message.reply("that channel is not in this server!");
        }
        var guildID = message.guild.id;
        var filePath = `./serverdata/${guildID}.json`;
        var apiURL = `https://api.spigotmc.org/legacy/update.php?resource=${args[0]}`;

        request.open("GET", apiURL, true);
        request.send();
        var sent = false;
        request.onreadystatechange = function () {
            var latestVersion = request.responseText;
            if (!latestVersion) return;
            if (sent) return;
            sent = true;
            var fileExists = false;
            fs.access(filePath, fs.F_OK, (err) => {
                if (err == null) {
                    fileExists = true;
                }
                if (err) {
                    fileExists = false;
                } else {
                    fileExists = true;
                }
            });
            var existingData = {};
            var useExistingData = false;
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    client.logger.log("Server File doesn't exist. Not reading for previous data")
                }
                if (!err) {
                    existingData = data;
                    useExistingData = true;
                }

                var resourceData = {
                    resourceID: resource.id,
                    channelID: channel.id,
                    lastCheckedVersion: latestVersion
                };
                var resourceObj = {
                    watchedResources: []
                };
                resourceObj.watchedResources.push(resourceData);
                saveJSON = resourceObj;

                if (useExistingData) {
                    var jsonExistingData = JSON.parse(existingData);
                    for (watchedResource of jsonExistingData.watchedResources) {
                        if (watchedResource.resourceID == resource.id){
                            return message.reply(`that resource is already being watched in <#${watchedResource.channelID}>`)
                        }
                    }
                    jsonExistingData.watchedResources.push(resourceData);
                    saveJSON = jsonExistingData;
                }
                fs.writeFile(filePath, JSON.stringify(saveJSON), err => {
                    if (err) throw err;
                });
                message.channel.send(`Resource, ${resource.name}, version ${latestVersion} is now being watched in channel ${channel}`);
            });

        };
        // let serverFile = JSON.parse(fs.readFileSync(`./${serverID}.json`, "utf8"));  
    }
};

function readJSON(filePath /*, destructive */) {
    let returnData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    /*if (destructive) {
    fs.unlinkSync(filePath);
    }*/
    return returnData;
}