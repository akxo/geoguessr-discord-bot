require('dotenv').config()
const {Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions, SlashCommandBuilder} = require('discord.js');
const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});

const apiKey = 'AIzaSyCQXuQ9SMHXdwYyoih_UDAqG-nEOjUtkMw'

var countryCode;
var isPlaying = false
var channelID

client.on('ready', (x) => {
    console.log(`${x.user.tag} is ready!`);

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
        if(!channelID) {
            channelID = interaction.channelId
        }
        console.log('slash command: start');

        if(isPlaying) {
            interaction.reply('practice already started');
        } else {
            interaction.reply('starting practice...');
            sendImage()
        }
    }
    if(interaction.commandName==='list') {
        console.log('slash command: list');

        interaction.reply(Object.keys(countries).map(key => `${countries[key]} - ${key}`).sort().join('\n'));
    }
    if(interaction.commandName==='give-up') {
        console.log('slash command: give-up');

        if(countryCode) {
            interaction.reply(`${countries[countryCode]} - ${countryCode}`);
            isPlaying = false
            sendImage()
        } else {
            interaction.reply(`practice not in session`);
        }
    }
})

client.on('messageCreate', async (message) => {
    if(message.author.bot) return;
    if(!isPlaying) return;

    console.log(`message received: ${message}`);

    const str = message.content.toLowerCase();
  
    if(str.length===2) {
        if(str===countryCode) {
            console.log(`${message} ✅`);

            message.react('✅');
            isPlaying = false
            sendImage()
        } else {
            console.log(`${message} ❌`);

            message.react('❌');
        }
    }
})

client.login(process.env.TOKEN);

async function sendImage() {
    const countryCodes = Object.keys(countries).sort();
    countryCode = countryCodes[Math.floor(Math.random()*countryCodes.length)];

    var radius = 1000; // 1km

    if(limitedCountries.includes(countryCode)) {
        radius = 100000; // 100km
    }

    var count = 0;

    while(true) {
        count += 1;

        if(count===11) {
            break;
        }

        console.log(`try ${count}`);

        const location = await getLocation(countryCode);

        const request = `size=800x400&location=${location.latt},${location.long}&heading=0&fov=120&radius=${radius}&key=${apiKey}`;

        const hasStreetView = await getStreetViewStatus(request);

        if (hasStreetView) {
            const url = `https://maps.googleapis.com/maps/api/streetview?${request}`;
            const image = new EmbedBuilder()
            .setImage(url);

            console.log('sending image...');
            console.log(url);

            client.channels.cache.get(channelID).send({ embeds: [image] });

            isPlaying = true
            break;
        }
    }
}

async function getLocation(countryCode) {
    const url = `https://api.3geonames.org/?randomland=${countryCode}`

    console.log('getting location...');
    console.log(url);

    const response = await fetch(url);

    if(!response) return;

    const xmlText = await response.text();

    const lattComponent = xmlText.split('<latt>')[1];
    const latt = lattComponent.split('</latt>')[0];

    const longComponent = lattComponent.split('<longt>')[1];
    const long = longComponent.split('</longt>')[0];

    return {
        'latt': latt,
        'long': long
    };
}

async function getStreetViewStatus(request) {
    const url = `https://maps.googleapis.com/maps/api/streetview/metadata?${request}`;
    
    console.log('getting street view status...');
    console.log(url);

    const response = await fetch(url);
    const json = await response.json();
    
    console.log(`status: ${json.status}`);

    if(json.status==='ZERO_RESULTS') return false;
    return true;
}

const limitedCountries = [
    "ug",
    "ng"
]

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