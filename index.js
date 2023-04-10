const { REST, Routes, ActionRowBuilder, Base, ButtonBuilder, ButtonStyle, Events, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, Client, GatewayIntentBits, Message, GuildMemberManager, BaseChannel, SelectMenuBuilder, User } = require('discord.js');
const { token, clientId } = require("./config.json");
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
    {
        name: 'get-regretted',
        description: 'Absolutely roast someone 😈',
        options: [{
            "name": "person",
            "description": "Roast this person",
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

function compliment_random(self) {
    log("")
    log("Generating random compliment...")
    let userID = self.options.getString('person');
    let compliment_message = userID + ", " + complimenter("random");
    self.reply(compliment_message);
    log('Compliment sent: "' + compliment_message + '"')
}

function compliment_nice(self) {
    log("")
    log("Generating random nice compliment...")
    let userID = self.options.getString('person');

    let compliment = complimenter("nice");
    let compliment_message = userID + ", " + compliment;
    self.reply(compliment_message);
    log('Compliment sent: "' + compliment_message + '"')
}

function get_regretted(self) {
    log("")
    log("Generating random roast...")
    let userID = self.options.getString('person');

    let roast = complimenter("roast");
    let compliment_message = userID + ", " + roast;
    self.reply(compliment_message);
    log('Roast sent: "' + compliment_message + '"')
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'compliment-random') {
        await compliment_random(interaction);
    }

    if (interaction.commandName === 'compliment') {
        await compliment_nice(interaction);
    }

    if (interaction.commandName === 'get-regretted') {
        await get_regretted(interaction);
    }
});

client.login(token);