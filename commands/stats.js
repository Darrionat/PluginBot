const { MessageEmbed } = require("discord.js");
const darrrionID = '163454178365145088';
module.exports = {
    name: "stats",
    description: "Multiple statistics of the bot!",
    aliases: [],
    guild: ["all"],
    nsfw: false,
    user_permissions: [],
    bot_permissions: [],
    args_required: 0,
    args_usage: "",
    cooldown: 5,

    async execute(client, message, args) {
        let darrionUser = await client.bot.users.fetch(darrrionID);
        var darrionAvatar = darrionUser.displayAvatarURL();

        // Get member count
        var members = 0;
        for (const key of client.bot.guilds.cache.keyArray()) {
            const guild = client.bot.guilds.cache.get(key);
            members += guild.memberCount;
        }

        const helpEmbed = new MessageEmbed();
        helpEmbed
            .setAuthor("Author: Darrion#0001", darrionAvatar, "https://wiki.darrionatplugins.com")
            .setColor(message.guild.me.displayHexColor)
            .setTitle(`${message.guild.me.displayName} Statistics`)
            .addFields(
                { name: 'Version', value: `${client.package.version}`, inline: true },
                { name: 'Users', value: `${members}`, inline: true },
                { name: 'Channels', value: `${client.bot.channels.cache.size}`, inline: true },
                { name: 'Servers', value: `${client.bot.guilds.cache.size}`, inline: true },
                { name: 'Commands', value: `${client.commands.size}`, inline: true },
                { name: 'Uptime', value: getUptime(client.bot), inline: true },
            )
            .setFooter(`Date Created: June 2, 2020`);
        message.channel.send({ embed: helpEmbed });
    }
};

function getUptime(client) {
    var milliseconds = client.uptime;
    let totalSeconds = (milliseconds / 1000);
    let days = Math.floor(totalSeconds / 86400);
    let hours = Math.floor(totalSeconds % 86400 / 3600);
    let minutes = Math.floor(totalSeconds % 3600 / 60);
    let seconds = Math.floor(totalSeconds % 60);

    var uptime = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
    if (days < 1) {
        uptime = `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
        if (hours < 1) {
            uptime = `${minutes} minutes, ${seconds} seconds`;
            if (minutes < 1) {
                uptime = `${seconds} seconds`;
            }
        }
    }
    return uptime;
}