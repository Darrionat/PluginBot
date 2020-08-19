const { MessageEmbed } = require("discord.js");
module.exports = { 
    name: "source",
    description: "A link to the bot's GitHub", 
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
            .setURL('https://github.com/Darrionat/PluginBot')
            .setColor(message.guild.me.displayHexColor)
            .setTitle(`Source Code`)
            .setDescription(`Click on this link to view my source code!`)
        message.channel.send({ embed: helpEmbed });
    }
};