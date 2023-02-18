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
    console.log(colorize("green", "Ready!"), colorize("yellow", `Logged in as ${client.user.tag}`));
});

// Start bot code

badWords = [
    "almost",
    "I am",
    "nearly",
    "kind of",
    "practically",
    "virtually",
    "somewhat",
    "terribly",
    "faintly",
    "fairly",
    "deftly",
]

const colors = {
    yellow: "\x1b[33m",
    blue: "\x1b[36m",
    red: "\x1b[31m",
    grey: "\x1b[38;5;254m",
    green: "\x1b[38;5;47m",
    NC: "\x1b[0m"
}

function colorize(color, message) {
    if (color == "blue") {
        return `${colors.blue}${message}${colors.NC}`
    } else if (color == "yellow") {
        return `${colors.yellow}${message}${colors.NC}`
    } else if (color == "red") {
        return `${colors.red}${message}${colors.NC}`
    } else if (color == "grey") {
        return `${colors.grey}${message}${colors.NC}`
    } else if (color == "green") {
        return `${colors.green}${message}${colors.NC}`
    } else {
        console.log(`${colors.yellow}Warning: ${colors.red}Garbage color argument!${colors.NC}`)
        return `${message}`
    }
}

function current_date() {
    let currentDate = new Date();
    let day = currentDate.getDate();
    let month = currentDate.getMonth() + 1;
    let year = currentDate.getFullYear();
    let date = `${month}-${day}-${year}`
    let time = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds() + ":" + currentDate.getMilliseconds();
    return `${time} ${date} ~ `
}

function log(message) {
    console.log(colorize("grey", current_date()), colorize("blue", message));
}

function check_compliment_is_nice(compliment) {
    for (let i = 0; i < badWords.length; i++) {
        if (compliment.includes(badWords[i])) {
            log(`Includes bad word: ${badWords[i]}`)
            return 1
        }
    };
    return 0
}

function compliment_random(self) {
    log("Generating random compliment...")
    let userID = self.options.getString('person');
    let compliment_message = userID + ", " + complimenter();
    self.reply(compliment_message);
    log("Compliment sent: " + compliment_message)
    log("")
}

function compliment_nice(self) {
    log("Generating random nice compliment...")
    let userID = self.options.getString('person');

    let compliment = complimenter();
    let a = check_compliment_is_nice(compliment)
    while (a == 1) {
        log("Regenerating compliment...")
        log("")
        compliment = complimenter();
        a = check_compliment_is_nice(compliment)
    }
    let compliment_message = userID + ", " + compliment;
    self.reply(compliment_message);
    log("Compliment sent: " + compliment_message)
    log("")
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