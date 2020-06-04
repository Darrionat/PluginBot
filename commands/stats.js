const { MessageEmbed } = require("discord.js");
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
        const helpEmbed = new MessageEmbed();
        helpEmbed
            .setAuthor("Author: Darrion#0001", "https://imgur.com/Fg8cB6r.png", "https://wiki.darrionatplugins.com")
            .setColor(message.guild.me.displayHexColor)
            .setTitle(`${message.guild.me.displayName} Help`)
            .setDescription(`Watching...`)
            .addFields(
                { name: 'Users', value: `${client.bot.users.cache.size}`, inline: true },
                { name: 'Channels', value: `${client.bot.channels.cache.size}`, inline: true },
                { name: 'Servers', value: `${client.bot.guilds.cache.size}`, inline: true },
            )
            .addField('Commands', client.commands.size, true,)
            .setFooter(`Date Created: June 2, 2020`);
        message.channel.send({ embed: helpEmbed });
    }
};