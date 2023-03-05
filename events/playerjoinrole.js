// Plugins by Darrion Discord ID 601497373075570737
const guildID = "601497373075570737";
const memberRoleID = "601576493335969792";

export default {
    name: "guildMemberAdd",

    async execute(client, member) {
        if (member.guild.id !== guildID) return;
        if (member.user.bot) return;

        let guild = client.bot.guilds.resolve(guildID);
        var memberRole = guild.roles.cache.get(memberRoleID);
        member.roles.add(memberRole);
    }
};
