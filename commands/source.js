import { EmbedBuilder } from "discord.js";
export default {
  name: "source",
  description: "A link to the bot's GitHub",
  aliases: [],
  guild: ["all"],
  nsfw: false,
  user_permissions: [],
  bot_permissions: [],
  args_required: 0,
  args_usage: "",
  cooldown: 5,

  async execute(client, message, args) {
    const helpEmbed = new EmbedBuilder();
    helpEmbed
      .setURL("https://github.com/Darrionat/PluginBot")
      .setColor(message.guild.members.me.displayHexColor)
      .setTitle(`Source Code`)
      .setDescription(`Click on this link to view my source code!`);
    message.reply({ embeds: [helpEmbed] });
  },
};
