const BOT_ID = "603751943982153740";
module.exports = {
    name: "message",

    async execute(client, message) {
        if (message.author == null) return;
        if (message.author.bot) return;
        if (message.mentions.users.has(BOT_ID)) {
            message.channel.send(`<@${message.author.id}> For information, type \`p!help\``);
        }
    }
};