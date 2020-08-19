module.exports = {
    name: "ready",

    async execute(client) {
        client.logger.log(`Logged in as ${client.bot.user.tag} on ${client.bot.guilds.cache.size} guilds`);
        client.logger.log(`Serving ${client.bot.users.cache.size} users in ${client.bot.channels.cache.size} channels`);

        client.bot.user.setStatus("available");

        const updatePresence = () => {
            
            client.bot.user.setActivity(`with SpigotMC | ${client.config.prefix}help`, { type: "PLAYING" }).catch(() => { 
           client.logger.error("Failed to set bot activity!");
            });
            setInterval(updatePresence, 10 * 60 * 1000);
        };
        updatePresence();
    }
};