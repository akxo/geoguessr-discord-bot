require('dotenv').config()
const {Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions, SlashCommandBuilder} = require('discord.js');
const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});

var countryCode;
var isPlaying = false
var channelID

client.on('ready', (x) => {
    console.log(`${x.user.tag} is ready!`);
    client.user.setActivity('this is a test');

    const start = new SlashCommandBuilder()
    .setName('start')
    .setDescription('start practice');

    const list = new SlashCommandBuilder()
    .setName('list')
    .setDescription('list all countries with coverage');

    const giveUp = new SlashCommandBuilder()
    .setName('give-up')
    .setDescription('reveal the answer');

    client.application.commands.create(start);
    client.application.commands.create(list);
    client.application.commands.create(giveUp);
})

client.on('interactionCreate', (interaction) => {
    if(!interaction.isChatInputCommand()) return;
    if(interaction.commandName==='start') {
        // TODO: - call send image func
        interaction.reply('starting practice...');

        countryCode = 'ca'
        isPlaying = true
    }
    if(interaction.commandName==='list') {
        interaction.reply(Object.keys(countries).map(key => `${countries[key]} - ${key}`).sort().join('\n'));
    }
    if(interaction.commandName==='give-up') {
        if(countryCode) {
            interaction.reply(`womp womp\n${countries[countryCode]} - ${countryCode}`);
        } else {
            interaction.reply(`practice not in session`);
        }
    }
})

client.on('messageCreate', async (message) => {
    if(message.author.bot) return;
    if(!isPlaying) return;

    const str = message.content.toLowerCase();
  
    if(str.length===2) {
        if(str===countryCode) {
            message.react('✅');
            isPlaying = false
        } else {
            message.react('❌');
        }
    }
})

client.login(process.env.TOKEN);

const countries = {
    "ad": "andorra",
    "ae": "united arab emirates",
    "al": "albania",
    "aq": "antarctica",
    "ar": "argentina",
    "as": "american samoa",
    "at": "austria",
    "au": "australia",
    "bd": "bangladesh",
    "be": "belgium",
    "bg": "bulgaria",
    "bm": "bermuda",
    "bo": "bolivia",
    "br": "brazil",
    "bt": "bhutan",
    "bw": "botswana",
    "ca": "canada",
    "cc": "cocos (keeling) islands",
    "ch": "switzerland",
    "ck": "cook islands",
    "cl": "chile",
    "co": "colombia",
    "cw": "curaçao",
    "cx": "christmas island",
    "cy": "cyprus",
    "cz": "czechia",
    "de": "germany",
    "dk": "denmark",
    "do": "dominican republic",
    "ec": "ecuador",
    "ee": "estonia",
    "eg": "egypt",
    "es": "spain",
    "fi": "finland",
    "fk": "falkland islands (malvinas)",
    "fo": "faroe islands",
    "fr": "france",
    "gb": "england",
    "gh": "ghana",
    "gl": "greenland",
    "gr": "greece",
    "gt": "guatemala",
    "gu": "guam",
    "hk": "hong kong",
    "hr": "croatia",
    "hu": "hungary",
    "id": "indonesia",
    "ie": "ireland",
    "il": "israel",
    "im": "isle of man",
    "in": "india",
    "is": "iceland",
    "it": "italy",
    "je": "jersey",
    "jo": "jordan",
    "jp": "japan",
    "ke": "kenya",
    "kg": "kyrgyzstan",
    "kh": "cambodia",
    "kr": "south korea",
    "kz": "kazakhstan",
    "la": "laos",
    "lb": "lebanon",
    "lk": "sri lanka",
    "ls": "lesotho",
    "lt": "lithuania",
    "lu": "luxembourg",
    "lv": "latvia",
    "mc": "monaco",
    "me": "montenegro",
    "mg": "madagascar",
    "mk": "north macedonia",
    "mn": "mongolia",
    "mp": "northern mariana islands",
    "mq": "martinique",
    "mt": "malta",
    "mx": "mexico",
    "my": "malaysia",
    "ng": "nigeria",
    "nl": "netherlands",
    "no": "norway",
    "nz": "new zealand",
    "pa": "panama",
    "pe": "peru",
    "ph": "philippines",
    "pk": "pakistan",
    "pl": "poland",
    "pr": "puerto rico",
    "pt": "portugal",
    "qa": "qatar",
    "re": "réunion",
    "ro": "romania",
    "rs": "serbia",
    "ru": "russia",
    "rw": "rwanda",
    "se": "sweden",
    "sg": "singapore",
    "si": "slovenia",
    "sj": "svalbard and jan mayen",
    "sk": "slovakia",
    "sn": "senegal",
    "sz": "eswatini",
    "th": "thailand",
    "tn": "tunisia",
    "tr": "turkey",
    "tw": "taiwan",
    "tz": "tanzania",
    "ua": "ukraine",
    "ug": "uganda",
    "us": "united states of america",
    "uy": "uruguay",
    "vi": "virgin islands (u.s.)",
    "vn": "vietnam",
    "za": "south africa"
};