import { EmbedBuilder } from "discord.js";
const darrrionID = '163454178365145088';
export default {
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
        client.bot.guilds.cache.forEach(guild => {
            members += guild.memberCount;
        });

        const helpEmbed = new EmbedBuilder();
        helpEmbed
            .setAuthor({
              name: "Author: Darrion#0001",
              iconURL: darrionAvatar,
              url: "https://wiki.darrionatplugins.com"
            })
            .setColor(message.guild.members.me.displayHexColor)
            .setTitle(`${message.guild.members.me.displayName} Statistics`)
            .addFields([
                { name: 'Version', value: `${client.package.version}`, inline: true },
                { name: 'Users', value: `${members}`, inline: true },
                { name: 'Channels', value: `${client.bot.channels.cache.size}`, inline: true },
                { name: 'Servers', value: `${client.bot.guilds.cache.size}`, inline: true },
                { name: 'Commands', value: `${client.commands.size}`, inline: true },
                { name: 'Uptime', value: getUptime(client.bot), inline: true },
            ])
            .setFooter({text: `Date Created: June 2, 2020`});
        message.reply({embeds: [helpEmbed]});
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
