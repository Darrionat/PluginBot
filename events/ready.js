export default {
    name: "ready",

    async execute(client) {
        client.logger.info(`Logged in as ${client.bot.user.tag} on ${client.bot.guilds.cache.size} guilds`);

        var members = 0;
            client.bot.guilds.cache.forEach(guild => {
            members += guild.memberCount;
        });
        client.logger.info(`Serving ${members} users in ${client.bot.channels.cache.size} channels`);

        client.bot.user.setStatus("available");

        const updatePresence = () => {
            const name = `with SpigotMC | ${client.config.prefix}help`;
            client.bot.user.setPresence({ activities: [{ name }], status: 'online' });
        };
        setInterval(updatePresence, 10 * 60 * 1000);
        updatePresence();
    }
};
