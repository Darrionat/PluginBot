const { EmbedBuilder } = require("discord.js");
const { Spiget } = require("spiget");
const spiget = new Spiget("Darrion's Plugin Bot");

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var request = new XMLHttpRequest();
module.exports = {
    name: "search",
    description: "Searches Spiget's API for a resource, and returns first result",
    aliases: [],
    guild: ["all"],
    nsfw: false,
    user_permissions: [],
    bot_permissions: [],
    args_required: 1,
    args_usage: `[resourceName] Example: p!searchResource Vault\nPro-Tip: Use -n [size] to adjust search size. Default = 100\nExample: p!search a -n 5000`,
    cooldown: 3,

    async execute(client, message, args) {

        // Checking for the size flag
        // Adjusts search size
        var size = 100;
        var sizeArgIndex = 0;
        var usingSizeFlag = false;
        for (var arg of args) {
            sizeArgIndex++;
            if (arg !== "-n") continue;
            size = args[sizeArgIndex];
            usingSizeFlag = true;
            break;
        }
        // Remove size flag from the search query
        if (usingSizeFlag){
           args.splice(sizeArgIndex -1, 2);
        }
        // Combine the arguments into a search string and request
        let search = concatenateArguments(args);
        var apiURL = `https://api.spiget.org/v2/search/resources/${search}?size=${size}`;

        var sent = false;
        request.onreadystatechange = function () {
            if (request.responseText == "") return;
            if (sent) return;
            try {
                var results = JSON.parse(request.responseText);
            } catch{
                return;
            }

            // Sort by downloads from a search list of 100 results
            var map = new Map();
            for (var resource of results) {
                let downloads = resource.downloads;
                map.set(resource, downloads);
            }
            var topResults = sortMapByValue(map);

            // Prepare list for embed
            var index = -1;
            var list = '';
            for (var [resource, downloads] of topResults) {
                index++;
                // Return the top 5 results only
                if (index == 5) break;
                let id = resource.id;
                let name = resource.name;

                let info = `**${name}**\n:arrow_double_down:*${downloads}  :id:${id}*\n`;

                // Compile list for the embed
                if (index == 0) {
                    list = `${info}`;
                    continue;
                }
                list = `${list}\n${info}`;

            }

            // Send embed
            var resultEmbed = new EmbedBuilder();
            if (list == undefined || list == '')
                list = `**No Results Found**`;

            resultEmbed
                .setColor(message.guild.members.me.displayHexColor)
                .setTitle(`:mag: Top 5 Results for '${search}'`)
                .setDescription(`${list}\n:arrow_double_down: - Downloads\n:id: - Plugin ID\n`)
                .setFooter(`Use ${client.config.prefix}plugin [id] for more information on a plugin`)
            list = '';
            sent = true;
            return message.reply({embeds: [resultEmbed]});
        }
        request.open("GET", apiURL, true);
        request.send();
    }
};

// Combine an array into a string. Spaces between arguments
function concatenateArguments(args) {
    var search = "";
    var index = 0;
    for (var word of args) {
        if (index == 0) {
            search = word;
            index++;
            continue;
        }
        search = `${search} ${word}`;
        index++;
    }
    return search;
}

// Sorts a [key, value] map by values in descending order
function sortMapByValue(map) {
    const mapSort = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
    return [...mapSort];
}