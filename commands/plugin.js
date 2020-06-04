const { MessageEmbed } = require("discord.js");
const { Spiget } = require("spiget");
const spiget = new Spiget("Darrion's Plugin Bot");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var request = new XMLHttpRequest();

module.exports = {
    name: "plugin",
    description: "Gets a plugin by its resource ID and returns details",
    aliases: [],
    guild: ["all"],
    nsfw: false,
    user_permissions: [],
    bot_permissions: [],
    args_required: 1,
    args_usage: "[resource_id]",
    cooldown: 5,

    async execute(client, message, args) {
        const helpEmbed = new MessageEmbed();
        try {
            var resource = await spiget.getResource(args[0]);
        } catch{
            message.reply(`uh oh ${args[0]} is not a valid resource id!`)
            return;
        }
        var author = (await resource.getAuthor()).name;

        var url = `https://api.spigotmc.org/legacy/update.php?resource=${resource.id}`;
        request.open('GET', url, true);
        request.send;
        request.onload = function () {
            console.log(request);
            var data = request.responseText;
            console.log(data);
        }
        // console.log(url);

        var versions = await resource.getVersions();
        var latestVersion = versions[0]._raw.name;

        var image = resource.icon.fullUrl();
        image = image.replace("orgdata", "org/data")

        helpEmbed

            .setAuthor(`Author: ${author}`, `${image}`)
            .setColor(message.guild.me.displayHexColor)
            .setTitle(`${resource.name}`)
            .setDescription(`${resource.tag}`)
            .addFields(
                { name: 'Version (Beta)', value: `${latestVersion}`, inline: true },
                { name: 'Download', value: `https://spigotmc.org/resources/.${args[0]}/`, inline: true }
            )
        return message.channel.send({ embed: helpEmbed });
    }
};