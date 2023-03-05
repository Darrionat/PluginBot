import { EmbedBuilder } from "discord.js";
export default {
    name: "invite",
    description: "The bot invite link!", 
    aliases: [], 
    guild: ["all"], 
    nsfw: false,
    user_permissions: [], 
    bot_permissions: [], 
    args_required: 0,
    args_usage: "",
    cooldown: 5, 

    async execute(client, message, args) {
        const helpEmbed = new EmbedBuilder();
        helpEmbed
            .setURL('https://discord.com/oauth2/authorize?client_id=603751943982153740&scope=bot&permissions=8')
            .setColor(message.guild.members.me.displayHexColor)
            .setTitle(`Bot Invite Link`)
            .setDescription(`Click on this link to add this bot to your Discord server!`)
        message.reply({embeds: [helpEmbed]});
    }
};
