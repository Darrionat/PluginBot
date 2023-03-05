export default {
    name: "ping",
    description: "The bots ping!",
    aliases: ["pingpong"], 
    guild: ["all"], 
    nsfw: false, 
    user_permissions: [], 
    bot_permissions: [], 
    args_required: 0, 
    args_usage: "", 
    cooldown: 5,

    async execute(client, message, args) {
        const m = await message.channel.send("Ping?");
        m.edit(`:ping_pong: Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms.`);
    }
};
