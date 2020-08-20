const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "help",
    description: "All the bot's commands and info on usage!",
    aliases: ["commands", "cmds"],
    guild: ["all"],
    nsfw: false,
    user_permissions: [],
    bot_permissions: [],
    args_required: 0,
    args_usage: "[commandName]",
    cooldown: 0,

    async execute(client, message, args) {
        const helpEmbed = new MessageEmbed();
        if (!args[0]) {
            const commandList = `\`${client.commands.keyArray().join("` `")}\``;
            helpEmbed
                .setAuthor("Author: Darrion#0001", "https://imgur.com/qxVPF9C.png", "https://wiki.darrionatplugins.com")
                .setColor(message.guild.me.displayHexColor)
                .setTitle(`${message.guild.me.displayName} Help`)
                .setDescription(commandList)
                .setFooter(`Use \`${client.config.prefix}${this.name} ${this.args_usage}\` for more detailed info!`);
        } else {
            const requestedCommand = args[0].replace(client.config.prefix, "");
            const command = client.commands.get(requestedCommand) || client.commands.get(client.aliases.get(requestedCommand));
            
            if (!command || (!command.guild.includes("all") && !command.guild.includes(message.guild.id)))
                return message.reply(`I can't find \`${requestedCommand}\` in the command list!`);

            helpEmbed
                .setTitle(`Command: ${command.name}`)
                .setDescription(command.description)
                .addField("Usage", `\`${client.config.prefix}${command.name} ${command.args_usage}\``)
                .addField("NSFW", command.nsfw)
                .addField("Cooldown", `${command.cooldown} seconds`);

            if (command.aliases && command.aliases.length > 0)
                helpEmbed.addField("Aliases", `\`${command.aliases.join("` `")}\``);

            if (command.user_permissions && command.user_permissions.length > 0)
                helpEmbed.addField("Permissions", `\`${command.user_permissions.join("` `")}\``);

            helpEmbed.setFooter(`Use \`${client.config.prefix}${this.name}\` to see all my commands!`);
        }

        return message.channel.send({ embed: helpEmbed });
    }
};