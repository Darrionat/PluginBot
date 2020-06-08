const DARRION_ID = "163454178365145088";
module.exports = {
    name: "message",

    async execute(client, message) {
        if (message.author == null) return;
        if (message.author.bot) return;
        if (message.member.hasPermission(["ADMINISTRATOR"])) return;
        if (message.mentions.users.has(DARRION_ID)) {
            message.delete()
                .then(msg => console.log(`Deleted message from ${msg.author.username} for pinging Darrionat`))
                .catch(console.error);
            message.channel.send(`<@${message.author.id}> Please do not ping Darrionat.`);
        }
    }
};