module.exports = {
    name: "messageCreate",

    async execute(client, message) {
        let BOT_ID = client.bot.user.id;
        if (message.author == null) return;
        if (message.author.bot) return;
        if (message.mentions.users.has(BOT_ID)) {
            message.channel.send(`<@${message.author.id}> For information, type \`p!help\``);
        }
    }
};
