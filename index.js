import Discord from "discord.js";
import { EmbedBuilder } from "discord.js";

import fs from "fs";
import { Spiget } from "spiget";
const spiget = new Spiget("Darrion's Plugin Bot");

import { XMLHttpRequest } from "xmlhttprequest";

import config from "./config.json" assert { type: "json" };
import logger from "./util/logger.js";
import packageData from "./package.json" assert { type: "json" };

/**
 * Set up ALL THE THINGS
 */
const client = {
  bot: new Discord.Client({
    intents: [
      Discord.IntentsBitField.Flags.Guilds,
      Discord.IntentsBitField.Flags.GuildMessages,
      Discord.IntentsBitField.Flags.MessageContent,
    ],
    partials: ["MESSAGE", "CHANNEL"],
  }),
  commands: new Map(),
  aliases: new Map(),
  cooldowns: new Map(),
  config,
  logger,
  packageData,
};

client.logger.info("Starting up...");

/**
 * Load all ".js" files in ./events and listen for emits
 */
const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

for (const eventFile of eventFiles) {
  const event = (await import(`./events/${eventFile}`)).default;
  client.bot.on(event.name, (...args) =>
    event.execute(client, ...args).catch(logger.error)
  );
}

client.logger.info(`Loaded ${eventFiles.length} events`);

/**
 * Load all ".js" files in ./commands and add to client.commands Map
 * Also check the file for assigned aliases and add to client.aliases Map
 */
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const commandFile of commandFiles) {
  const command = (await import(`./commands/${commandFile}`)).default;
  client.commands.set(command.name, command);

  if (command.aliases && command.aliases.length > 0) {
    for (const alias of command.aliases) {
      client.aliases.set(alias, command.name);
    }
  }
}
/*
    Checks for updates every 1 minute
    1m = 60 * 1000 ms;
*/
setInterval(checkUpdates, 60 * 5 * 1000);

async function checkUpdates() {
  try {
    var serverDataDir = fs.readdirSync("./serverdata");
  } catch (error) {
    client.logger.info("No ./serverdata directory", "warn");
    return;
  }
  const serverFiles = serverDataDir.filter((file) => file.endsWith(".json"));

  for (const serverFile of serverFiles) {
    const filePath = `./serverdata/${serverFile}`;
    let jsonExistingData = JSON.parse(getJSONFileData(filePath));

    for (let watchedResource of jsonExistingData.watchedResources) {
      const updateEmbed = new EmbedBuilder();
      const id = watchedResource.resourceID;
      const channel = client.bot.channels.cache.get(watchedResource.channelID);

      let resource;
      try {
        resource = await spiget.getResource(id);
      } catch (e) {
        logger.error(e);
        return;
      }
      if (resource == undefined) {
        continue;
      }

      let author;
      try {
        author = (await resource.getAuthor()).name;
      } catch (e) {
        logger.error(e);
        return;
      }

      let image = resource.icon.fullUrl();
      image = image.replace("orgdata", "org/data");

      const latestVersion = await getResourceVersion(id);

      // Up to date
      if (watchedResource.lastCheckedVersion == latestVersion) {
        continue;
      }

      let updateDesc = await getUpdateDescription(id);
      if (updateDesc.length > 1024)
        updateDesc = `Description greater than 1024 characters`;
      // Send embed
      updateEmbed
        .setAuthor({ name: `Author: ${author}`, iconURL: image })
        .setColor(channel.guild.members.me.displayHexColor)
        .setTitle(`An update for ${resource.name} is available`)
        .setDescription(`${resource.tag}`)
        .addFields([
          { name: "Version", value: `${latestVersion}`, inline: false },
          { name: "Update Description", value: updateDesc, inline: false },
          {
            name: "Download",
            value: `https://spigotmc.org/resources/.${id}/`,
            inline: false,
          },
        ]);
      watchedResource.lastCheckedVersion = latestVersion;
      fs.writeFile(filePath, JSON.stringify(jsonExistingData), (err) => {
        if (err) throw err;
      });
      client.bot.channels.cache
        .get(watchedResource.channelID)
        .send({ embed: updateEmbed });

      continue;
    }
  }
}

async function getResourceVersion(id) {
  const idRequest = new XMLHttpRequest();
  var latestVersion = null;

  idRequest.onreadystatechange = function () {
    const latestVersionData = idRequest.responseText;
    const dataJSON = JSON.parse(latestVersionData);
    latestVersion = dataJSON.name;
  };
  idRequest.open(
    "GET",
    `https://api.spiget.org/v2/resources/${id}/versions/latest`,
    false
  );
  idRequest.send();
  while (latestVersion == null) {}
  return latestVersion;
}

async function getUpdateDescription(id) {
  const updateRequest = new XMLHttpRequest();
  var updateDesc = null;

  updateRequest.onreadystatechange = function () {
    const latestUpdate = updateRequest.responseText;
    const data = JSON.parse(latestUpdate);
    updateDesc = formatText(Buffer.from(data.description, "base64").toString());
  };
  updateRequest.open(
    "GET",
    `https://api.spiget.org/v2/resources/${id}/updates/latest`,
    false
  );
  updateRequest.send();
  while (latestVersion == null) {}
  return updateDesc;
}

function getJSONFileData(filePath) {
  return fs.readFileSync(filePath, (err, data) => {
    if (err) return;
    return JSON.parse(data);
  });
}

function formatText(description) {
  description = description.replace(/<b>/gi, "**");
  description = description.replace(/<\/b>/gi, "**");
  description = description.replace(/<i>/gi, "*");
  description = description.replace(/<\/i>/gi, "**");
  description = description.replace(/<ul>/gi, "");
  description = description.replace(/<\/ul>/gi, "");
  description = description.replace(/<li>/gi, "");
  description = description.replace(/<\/li>/gi, "");
  description = description.replace(/<br>/gi, "");
  return description;
}

client.logger.info(`Registered ${commandFiles.length} commands`);

client.logger.info("Logging in...");
client.bot.login(client.config.token);
