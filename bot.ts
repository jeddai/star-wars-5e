import * as Discord from 'discord.js';
import * as _ from 'lodash';
import * as fs from 'fs';

import {PlanetBot} from './bot/PlanetBot';
import {ForceDirectedNode} from './src/app/classes/ForceDirectedNode';

const client = new Discord.Client();
const token = '';
const userID = '341981649497620480';

const includeChannels: string[] = [
  '342036714736320512'
];

let planetBot: PlanetBot = new PlanetBot();

client.on('ready', () => {
  console.log('C-3PO, at your service!');
  construct();
});

client.on('message', message => {
  let response = '';
  if((message.isMentioned(userID) || message.content.search('@C-3PO') !== -1 || _.includes(includeChannels, message.channel.id)) && !message.author.bot) {
    const content = clean(message.content);

    planetBot.message = message;

    if (_.isEqual(content, 'ping')) response = 'pong';
    else if (_.isEqual(content, 'help')) response = help();
    else if (planetBot.isRequestingPlanet()) response = planetBot.analyze();
    else if(message.isMentioned(userID)) response = `Unfortunately, I am unable to decipher what you mean by \`${ content }\`. I have failed you, oh dear I do hope the maker does not sell me for scrap... I will gladly tell you what I *can* do if you just send the phrase \`help\`.`;

    if(!!response) {
      logMessage(message, response);
      message.reply(response);
    }
  }
});

client.login(token);

// Functions

function logMessage(message: Discord.Message, response?: string) {
  console.log(`${message.author.username}: '${message.content}'`);
  if(!!response) console.log(`Res: ${response}`);
}

function construct() {
  let obj = [];
  fs.readdir(__dirname + '/data/planets', (err, planetFiles) => {
    if (err) throw err;
    planetFiles.forEach(function(f) {
      const planet = JSON.parse(fs.readFileSync(__dirname + '/data/planets/' + f, 'utf8'));
      if (planet.active) {
        obj.push(<ForceDirectedNode>planet);
      }
    });
    planetBot.nodes = obj;
  });
}

function clean(content: string): string {
  content = _.replace(content, new RegExp(/<[^>]+>/), '');
  content = _.trim(content);
  return content;
}

function help(): string {
  return `Hello! I am C-3PO, human-discord relations! I am fluent in only a few things right now, the maker has not given me many abilities yet. Here is what I can do!
  **Utility:**
  - \`ping\`: I will play ping pong with you so you know how bad my latency is.
  **Planets:**
  - \`list planets\`: I will list all the available planets.
  - \`planet {planet name}\`: I will tell you about whatever planet you want to know about!
  `
}
