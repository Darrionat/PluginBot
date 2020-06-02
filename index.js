const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
// const BOT_ID = "603751943982153740";
const client = new Discord.Client();
const MessageEmbed = Discord.MessageEmbed;

client.once("ready", () => {
    console.log("Ready!");
    client.user.setActivity(`with code ${prefix}help`);
});


// Ping Listener
const DARRION_ID = "163454178365145088";
client.on('message', message => {
    if (message.member.hasPermission(["ADMINISTRATOR"])) return;
    if (message.author.bot) return;
    if (message.mentions.users.has(DARRION_ID)) {
        message.delete()
            .then(msg => console.log(`Deleted message from ${msg.author.username}`))
            .catch(console.error);
        message.channel.send(`<@${message.author.id}> Please do not ping Darrionat.`);
    }
});

const noPermissionMessage = "You do not have permission to do that!";

// Commands
client.on('message', async message => {
    // If the message is "how to embed"
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (command === "help") {
        const embed = new MessageEmbed()
            .setTitle('Commands')
            .setColor(0xff0000)
            .setDescription(`
            ${prefix}wiki - Links the wiki \n
            ${prefix}ping - Tests latency`);
        message.channel.send(embed);
        if (message.member.hasPermission("ADMINISTRATOR")) {
            const embed = new MessageEmbed()
                .setTitle('Admin Commands')
                .setColor(0xff0000)
                .setDescription(`
            ${prefix}update - Put out a plugin update announcement`);
            message.channel.send(embed);
        }
    }
    if (command === "wiki") {
        message.channel.send('https://wiki.darrionatplugins.com');
    }
    if (command === "ping") {
        // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
        // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
        const m = await message.channel.send("Ping?");
        m.edit(`:ping_pong: Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms.`);
    }
    if (command === "update") {
        if (!message.member.hasPermission("ADMINISTRATOR")){
           return message.channel.send(noPermissionMessage);
        }
        message.channel.send("");
    }
});

client.login(token);