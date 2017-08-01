import * as Discord from 'discord.js';
import * as fs from 'fs';
import * as _ from 'lodash';
import {ForceDirectedGraphData} from "./src/app/classes/ForceDirectedGraphData";
import {ForceDirectedNode} from "./src/app/classes/ForceDirectedNode";

const dir = __dirname;
const client = new Discord.Client();
const token = '';
const userID = '341981649497620480';

let planetsData: ForceDirectedGraphData = {} as ForceDirectedGraphData;

client.on('ready', () => {
  console.log('I am ready!');
  coalesceData();
});

client.on('message', message => {
  if((message.isMentioned(userID) || message.channel.id === '342036714736320512') && !message.author.bot) {
    let content = clean(message.content);
    console.log(`${ message.author.username }: '${ content }'`);
    let words: string[] = _.words(content);

    if (_.includes(words, 'ping')) {
      message.reply('pong');
    }
    else if (_.isEqual(content, 'help')) message.reply(help());
    else if (_.includes(words, 'planet')) {
      let index = 1 + words.findIndex((w) => {
        return w === 'planet';
      });
      message.reply(planet(words[index], content));
    }
    else if (_.isEqual(content, 'list planets')) message.reply(listPlanets());
    else message.reply(`Unfortunately, I am unable to decipher what you mean by \`${ content }\`. I have failed you, oh dear I do hope the maker does not sell me for scrap... I will gladly tell you what I *can* do if you just send the phrase \`help\`.`)
  }
});

client.login(token);

// Functions

function clean(content: string): string {
  content = _.replace(content, new RegExp(/<[^>]+>/), '');
  content = _.trim(content);
  return content;
}

function coalesceData(): void {
  let fullPath = dir + '/data/planets';
  const obj: ForceDirectedGraphData = {
    nodes: [],
    links: []
  };
  fs.readdir(fullPath, (err, planetFiles) => {
    obj.nodes = [];
    if (err) throw err;
    planetFiles.forEach(function(f) {
      const planet = JSON.parse(fs.readFileSync(fullPath + '/' + f, 'utf8'));
      if (planet.active) {
        obj.nodes.push(<ForceDirectedNode>planet);
      }
    });
    obj.links = [];
    // obj.links = obj.links.concat(createLinks(obj.nodes));
    planetsData = obj;
  });
}

function planet(planetName: string, message: string): string {
  let planet: ForceDirectedNode = _.find(planetsData.nodes, { name: planetName });
  if(!planet) {
    planetsData.nodes.forEach((p) => {
      if (message.search(p.name) !== -1)
        planet = _.find(planetsData.nodes, { name: p.name });
    })
  }
  if(!!planet) return getPlanetData(planet);
  else return `I am so terribly sorry, but I cannot find a planet named \`${ planetName }\` in my databanks. Are you sure that's a real planet? Use \`planet list\` to make sure.`;
}

function getPlanetData(planet: ForceDirectedNode): string {
  let returnVal: string = `**${ planet.name }:**`;
  if (planet.climate) returnVal += `\nClimate: ${ planet.climate }`;
  if (planet.system) returnVal += `\nCapital: ${ planet.capital }`;
  if (planet.inhabitants) returnVal += `\nInhabitants: ${ _.join(planet.inhabitants.sort(), ', ') }`;
  if (!!planet.alignment.length) returnVal += `\nAlignment: ${ _.join(planet.alignment.sort(), ', ') }`;
  if (!!planet.hyperspace.length) {
    returnVal += `\nConnected Planets: `;
    _.sortBy(planet.hyperspace, (h) => { return h.planet }).forEach((h, i) => {
      returnVal += h.planet;
      if (i !== planet.hyperspace.length - 1) {
        returnVal += ', ';
      }
    })
  }
  return returnVal;
}

function listPlanets(): string {
  let planets = '**All Planets:** ';
  planetsData.nodes.forEach((p, index) => {
    planets += p.name;
    if (index !== planetsData.nodes.length - 1) {
      planets += ', ';
    }
  });
  return planets;
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
