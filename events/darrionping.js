import { PermissionsBitField } from "discord.js";
const DARRION_ID = "163454178365145088";
const PLUGIN_DISCORD_ID = "601497373075570737";
export default {
    name: "messageCreate",

    async execute(client, message) {
        if (message.author == null) return;
        if (message.author.bot) return;
        if (message.member.permissions.has([PermissionsBitField.Flags.Administrator])) return;
        if (message.guild.id != PLUGIN_DISCORD_ID) return;
            if (message.mentions.users.has(DARRION_ID)) {
                message.channel.send(`<@${message.author.id}> Please do not ping Darrion.`);
            }
    }
};
