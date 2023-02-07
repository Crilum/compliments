const { REST, Routes, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, Client, GatewayIntentBits, Message, BaseChannel, SelectMenuBuilder } = require('discord.js');
const { token, clientId } = require("./config.json");
const http = require('http');
const https = require('https');
var complimenter = require("complimenter");

const commands = [
    {
        name: 'compliment',
        description: 'Compliment someone..',
        options: [{
            "name": "person",
            "description": "Compliment *this* person",
            "type": 3
        }],
    },
];

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(clientId), { body: commands });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const channel = client.channels.cache
console.log("channel: " + channel + ", id: ");
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

function compliment(self) {
    person = self.options.getString('person');
        self.reply(person + ", " + complimenter());
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'compliment') {
        await compliment(interaction);
    }
});

client.login(token);