import { EmbedBuilder } from "discord.js";
import { Spiget } from "spiget";
const spiget = new Spiget("Darrion's Plugin Bot");

import { XMLHttpRequest } from "xmlhttprequest";
const request = new XMLHttpRequest();

export default {
  name: "plugin",
  description: "Gets a plugin by its resource ID and returns details",
  aliases: [],
  guild: ["all"],
  nsfw: false,
  user_permissions: [],
  bot_permissions: [],
  args_required: 1,
  args_usage: "[resource_id]",
  cooldown: 5,

  async execute(client, message, args) {
    const helpEmbed = new EmbedBuilder();
    try {
      var resource = await spiget.getResource(args[0]);
    } catch (e) {
      client.logger.error(e);
      message.reply(`uh oh ${args[0]} is not a valid resource id!`);
      return;
    }
    try {
      var author = (await resource.getAuthor()).name;
    } catch (e) {
      client.logger.error(e);
      message.reply(`uh oh could not find author for ${args[0]}`);
      return;
    }

    var image = resource.icon.fullUrl().replace("orgdata", "org/data");
    var apiURL = `https://api.spigotmc.org/legacy/update.php?resource=${args[0]}`;

    request.open("GET", apiURL, true);
    request.send();
    var sent = false;
    request.onreadystatechange = function () {
      var latestVersion = request.responseText;
      if (!latestVersion) return;
      if (sent) return;

      helpEmbed
        .setAuthor({ text: `Author: ${author}`, iconURL: image })
        .setColor(message.guild.members.me.displayHexColor)
        .setTitle(`${resource.name}`)
        .setDescription(`${resource.tag}`)
        .addFields([
          { name: "Version", value: `${latestVersion}`, inline: true },
          {
            name: "Download",
            value: `https://spigotmc.org/resources/.${args[0]}/`,
            inline: true,
          },
        ]);
      sent = true;
      return message.reply({ embeds: [helpEmbed] });
    };
  },
};
