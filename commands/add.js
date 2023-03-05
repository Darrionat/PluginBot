import { EmbedBuilder, PermissionsBitField } from "discord.js";
import fs from "fs";
import { Spiget } from "spiget";
const spiget = new Spiget("Darrion's Plugin Bot");

import { XMLHttpRequest } from "xmlhttprequest";
const request = new XMLHttpRequest();

export default {
  name: "add",
  description:
    "Sets up a listener to post updates of a plugin in a defined channel",
  aliases: [],
  guild: ["all"],
  nsfw: false,
  user_permissions: [PermissionsBitField.Flags.Administrator],
  bot_permissions: [],
  args_required: 2,
  args_usage: `[resource_id] [channel] Example: p!add 72678 #announcements`,
  cooldown: 5,

  async execute(client, message, args) {
    let resource;
    try {
      resource = await spiget.getResource(args[0]);
    } catch (e) {
      client.logger.error(e);
      message.reply(`uh oh ${args[0]} is not a valid resource id!`);
      return;
    }
    let author;
    try {
      author = (await resource.getAuthor()).name;
    } catch (e) {
      client.logger.error(e);
      message.reply(`uh oh could not find author for ${args[0]}`);
      return;
    }
    var channel = message.mentions.channels.first();
    if (channel === undefined) {
      return message.reply(
        "that channel is undefined. Try mentioning a channel in this server"
      );
    }
    var channelInServer = message.guild.channels.cache.has(channel.id);
    if (!channelInServer) {
      return message.reply("that channel is not in this server!");
    }
    var guildID = message.guild.id;
    var filePath = `./serverdata/${guildID}.json`;
    var apiURL = `https://api.spigotmc.org/legacy/update.php?resource=${args[0]}`;

    request.open("GET", apiURL, true);
    request.send();
    var sent = false;
    request.onreadystatechange = function () {
      var latestVersion = request.responseText;
      if (!latestVersion) return;
      if (sent) return;
      sent = true;
      var fileExists = false;
      fs.access(filePath, fs.F_OK, (err) => {
        if (err == null) {
          fileExists = true;
        }
        if (err) {
          fileExists = false;
        } else {
          fileExists = true;
        }
      });
      var existingData = {};
      var useExistingData = false;

      fs.readFile(filePath, (err, data) => {
        if (err) {
          client.logger.info(
            "Server File doesn't exist. Not reading for previous data"
          );
        }
        if (!err) {
          existingData = data;
          useExistingData = true;
        }

        var resourceData = {
          resourceID: resource.id,
          channelID: channel.id,
          lastCheckedVersion: latestVersion,
        };
        var resourceObj = {
          watchedResources: [],
        };
        resourceObj.watchedResources.push(resourceData);
        saveJSON = resourceObj;

        if (useExistingData) {
          var jsonExistingData = JSON.parse(existingData);
          for (watchedResource of jsonExistingData.watchedResources) {
            if (watchedResource.resourceID == resource.id) {
              return message.reply(
                `that resource is already being watched in <#${watchedResource.channelID}>`
              );
            }
          }
          jsonExistingData.watchedResources.push(resourceData);
          saveJSON = jsonExistingData;
        }
        fs.writeFile(filePath, JSON.stringify(saveJSON), (err) => {
          if (err) throw err;
        });
        const resourceEmbed = new EmbedBuilder();
        var image = resource.icon.fullUrl();
        image = image.replace("orgdata", "org/data");
        resourceEmbed
          .setAuthor({ text: `Author: ${author}`, iconURL: image })
          .setColor(message.guild.members.me.displayHexColor)
          .setTitle(`Now watching: ${resource.name}`)
          .setDescription(`${resource.tag}`)
          .addFields([
            { name: "Channel", value: `${channel}`, inline: false },
            { name: "Version", value: `${latestVersion}`, inline: true },
            {
              name: "Download",
              value: `https://spigotmc.org/resources/.${args[0]}/`,
              inline: true,
            },
          ]);
        sent = true;
        return message.reply({ embeds: [resourceEmbed] });
      });
    };
  },
};

function readJSON(filePath /*, destructive */) {
  let returnData = JSON.parse(fs.readFileSync(filePath, "utf8"));

  /*if (destructive) {
    fs.unlinkSync(filePath);
    }*/
  return returnData;
}
