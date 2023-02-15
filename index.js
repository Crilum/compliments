const { REST, Routes, ActionRowBuilder, Base, ButtonBuilder, ButtonStyle, Events, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, Client, GatewayIntentBits, Message, GuildMemberManager, BaseChannel, SelectMenuBuilder, User } = require('discord.js');
const { token, clientId, guildID } = require("./config.json");
const http = require('http');
const https = require('https');
var complimenter = require("complimenter");

const commands = [
    {
        name: 'compliment-random',
        description: 'Compliment someone.. Or end up roasting them..',
        options: [{
            "name": "person",
            "description": "Compliment this person",
            "type": 3,
            "required": "true",
        }],
    },
    {
        name: 'compliment',
        description: 'Compliment someone',
        options: [{
            "name": "person",
            "description": "Compliment this person",
            "type": 3,
            "required": "true",
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
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Start bot code

function current_date() {
    let currentDate = new Date();
    let day = currentDate.getDate();
    let month = currentDate.getMonth() + 1;
    let year = currentDate.getFullYear();
    let date = `${month}-${day}-${year}`
    let time = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds() + ":" + currentDate.getMilliseconds();
    return `${time} ${date}>> `
}

function check_compliment_is_nice(compliment) {
    badWords = [
        "almost",
        "I am",
        "nearly",
        "kind of",
        "practically",
        "virtually",
        "somewhat",
        "terribly",
    ]
    for (let i = 0; i < badWords.length; i++) {
        if (compliment.includes(badWords[i])) {
            console.log(current_date(), "Includes bad word:", badWords[i])
            return 1
        }
    };
    return 0
}

function compliment_random(self) {
    console.log(current_date(), "Generating random compliment...")
    console.log("")
    let userID = self.options.getString('person');
    self.reply(userID + ", " + complimenter());
}

function compliment_nice(self) {
    console.log(current_date(), "Generating nice random compliment...")
    console.log("")
    let userID = self.options.getString('person');

    let compliment = complimenter();
    let a = check_compliment_is_nice(compliment)
    while (a == 1) {
        console.log(current_date(), "Regenerating compliment...")
        console.log("")
        compliment = complimenter();
        a = check_compliment_is_nice(compliment)
    }
    self.reply(userID + ", " + compliment);
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'compliment-random') {
        await compliment_random(interaction);
    }

    if (interaction.commandName === 'compliment') {
        await compliment_nice(interaction);
    }
});

client.login(token);