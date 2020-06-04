const chalk = require("chalk");
const moment = require("moment");

module.exports.log = (content, type = "log") => {
    const timestamp = `[${moment().format("YYYY-MM-DD HH:mm:ss")}]`;

    switch (type.toLowerCase()) {
        case "log": return console.log(`${timestamp} ${chalk.black.bgWhite(type.toUpperCase())} ${content}`);
        case "err": return console.log(`${timestamp} ${chalk.bgRed(type.toUpperCase())} ${content}`);
        case "wrn": return console.log(`${timestamp} ${chalk.black.bgYellow(type.toUpperCase())} ${content}`);
        case "cmd": return console.log(`${timestamp} ${chalk.bgBlue(type.toUpperCase())} ${content}`);
        default: return this.log(content, "log"); 
    }
};

module.exports.cmd = (...args) => this.log(...args, "cmd");
module.exports.warn = (...args) => this.log(...args, "wrn");
module.exports.error = (...args) => this.log(...args, "err");