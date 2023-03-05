import { EmbedBuilder, PermissionsBitField } from "discord.js";
import fs from "fs";

export default {
  name: "list",
  description: "Lists listeners for plugin updates",
  aliases: [],
  guild: ["all"],
  nsfw: false,
  user_permissions: [PermissionsBitField.Flags.Administrator],
  bot_permissions: [],
  args_required: 0,
  args_usage: ``,
  cooldown: 5,

  async execute(client, message, args) {
    const guildID = message.guild.id;
    const filePath = `./serverdata/${guildID}.json`;

    fs.access(filePath, fs.F_OK, (err) => {
      if (err) {
        message.reply("this server does not have any watched resources!");
        return;
      }
    });

    const data = JSON.parse(getJSONFileData(filePath));
    var index = -1;
    var list = "";
    for (const watchedResource of data.watchedResources) {
      index++;
      let id = watchedResource.resourceID;
      if (index == 0) {
        list = `${id} <#${watchedResource.channelID}>`;
        continue;
      }
      list = `${list}\n${id} <#${watchedResource.channelID}>`;
    }
    var listEmbed = new EmbedBuilder();

    listEmbed
      .setColor(message.guild.members.me.displayHexColor)
      .setTitle(`Watched Resources`)
      .setDescription(`${list}`);
    return message.reply({ embeds: [listEmbed] });
  },
};

function getJSONFileData(filePath) {
  return fs.readFileSync(filePath, (err, data) => {
    if (err) return;
    return JSON.parse(data);
  });
}
