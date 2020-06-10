const fs = require("fs");
const { Spiget } = require("spiget");
const spiget = new Spiget("Darrion's Plugin Bot");

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var request = new XMLHttpRequest();

module.exports = {
    name: "remove",
    description: "Stops the listener for plugin updates",
    aliases: [],
    guild: ["all"],
    nsfw: false,
    user_permissions: ["ADMINISTRATOR"],
    bot_permissions: [],
    args_required: 1,
    args_usage: `[resource_id]`,
    cooldown: 5,

    async execute(client, message, args) {
        var guildID = message.guild.id;
        var filePath = `./serverdata/${guildID}.json`;

        fs.access(filePath, fs.F_OK, (err) => {
            if (err) {
                message.reply("this server does not have any watched resources!");
                return;
            }
        });

        var data = JSON.parse(getJSONFileData(filePath));
        var index = -1;
        const length = data.watchedResources.length;
        for (const watchedResource of data.watchedResources) {
            index++;
            let id = watchedResource.resourceID;
            if (id != args[0]) continue;
            data.watchedResources.splice(index, 1);
            fs.writeFile(filePath, JSON.stringify(data), err => {
                if (err) throw err;
            });
            message.channel.send(`Resource ${id} is no longer being watched.`);
            if (length ==1) {
               fs.unlinkSync(filePath);
            }
            return;
        } 
        message.channel.send(`Error: Resource ${args[0]} was not being watched in this server`);

    }
};

function getJSONFileData(filePath) {
    return fs.readFileSync(filePath, (err, data) => {
        if (err) return;
        return JSON.parse(data);
    });
}