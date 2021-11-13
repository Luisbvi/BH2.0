const { Client, Collection } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const client = new Client({ intents: 32767})
const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);
const Ascii = require("ascii-table");

client.commands = new Collection();

require("../Systems/GiveawaySys")(client);

["Events", "Commands"].forEach(handler => {
    require(`./Handlers/${handler}`)(client, PG, Ascii);
});


client.login(process.env.TOKEN);