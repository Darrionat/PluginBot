module.exports = {
    name: "message",

    async execute(client, message) {
        if (message.author.bot || !message.guild) return;

        if (message.content === `<@${client.bot.user.id}>`)
            return message.reply(`My prefix is: \`${client.config.prefix}\``);

        /**
         * Command Parsing
         */
        if (!message.content.startsWith(client.config.prefix)) return;

        const args = message.content.slice(client.config.prefix.length).trim().split(" ");
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));
        
        /**
         * Check its a valid command and if it's allowed to be ran in this guild
         */
        if (!command || (!command.guild.includes("all") && !command.guild.includes(message.guild.id))) return;

        /**
         * Check if the user is on cooldown
         */
        if (client.cooldowns.has(`${message.guild.id}-${message.author.id}`)) {
            if (command.name === client.cooldowns.get(`${message.guild.id}-${message.author.id}`)) 
                return message.reply(`Please wait ${command.cooldown} second(s) before running that command again!`);
        }

        /**
         * Check if the command/channel is NSFW
         */
        if (command.nsfw && !message.channel.nsfw)
            return message.reply("That command is marked as NSFW. Please run it in an NSFW channel!");
        
        /**
         * Check if the user gave us enough arguements
         */
        if (command.args_required > 0 && args.length < command.args_required) {
            if (!command.args_usage)
                return message.reply("You didn't provide enough arguments for that command!");
            else  
                return message.reply(`You didn't provide enough arguments for that command! Correct Usage: \`${client.config.prefix}${command.name} ${command.args_usage}\``);
        }

        /**
         * Check if the user has the required permissions
         */
        if (command.user_permissions && command.user_permissions.length > 0) {
            if (!message.member.hasPermission(command.user_permissions)) 
                return message.reply(`You don't have permission to run that command! \`${command.user_permissions.join("` `")}\``);
        }
                
        /**
         * Check if we have the required permissions to complete whatever we wanna do
         */
        if (command.bot_permissions && command.bot_permissions.length > 0) {
            if (!message.guild.me.hasPermission(command.bot_permissions)) 
                return message.reply(`I don't have correct permissions to run that command! \`${command.bot_permissions.join("` `")}\``);
        }

        /**
         * Execute the command \o/
         */
        command.execute(client, message, args);
        client.logger.cmd(`[${message.guild.name}] [#${message.channel.name}] (${message.author.username}) ${message.content}`);

        /**
         * Update cooldowns
         */
        client.cooldowns.set(`${message.guild.id}-${message.author.id}`, command.name);
        setTimeout(() => { 
            client.cooldowns.delete(`${message.guild.id}-${message.author.id}`);
        }, command.cooldown * 1000);
    }
};