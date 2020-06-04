const { MessageEmbed } = require("discord.js");
module.exports = { 
    name: "wiki",
    description: "The Wiki link!", 
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
            .setURL('https://wiki.darrionatplugins.com')
            .setColor(message.guild.me.displayHexColor)
            .setTitle(`Darrionat's Plugins Wiki`)
        message.channel.send({ embed: helpEmbed });
    }
};