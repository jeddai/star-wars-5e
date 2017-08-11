import * as Discord from 'discord.js';
import * as _ from 'lodash';

import {ForceDirectedNode} from 'contracts/interfaces';

export class PlanetBot {
  private _nodes: ForceDirectedNode[];
  private _message: Discord.Message;

  set message(message: Discord.Message) {
    this._message = message;
  }

  set nodes(nodes: ForceDirectedNode[]) {
    this._nodes = nodes;
  }

  constructor(nodes?: ForceDirectedNode[], message?: Discord.Message) {
    if(!!nodes) this._nodes = nodes;
    if(!!message) this._message = message;
  }

  public isRequestingPlanet(): boolean {
    console.log(this);
    return !_.isNull(this._message.content.match(/(planet|list planets|search planets)/));
  }

  public analyze(): string {
    if (!_.isNull(this._message.content.match(/list planets/))) return this.listPlanets();
    if (!_.isNull(this._message.content.match(/(?=planet)[^>]+/))) return this.planet(/(?=planet)[^>]+/.exec(this._message.content)[0].replace(/planet/, '').trim());
    return '';
  }

  private planet(planetName: string): string {
    let planet: ForceDirectedNode;
    if(!planet) {
      this._nodes.forEach((p) => {
        if (_.lowerCase(this._message.content).search(_.lowerCase(p.name)) !== -1)
          planet = _.find(this._nodes, { name: p.name });
      })
    }
    if(!!planet) return this.getPlanetData(planet);
    else return `I am so terribly sorry, but I cannot find a planet named ${planetName} in my databanks. Are you sure that's a real planet? Use \`planet list\` to see.`;
  }

  private getPlanetData(planet: ForceDirectedNode): string {
    let returnVal: string = `**${ planet.name }:**`;
    try {
      if (planet.climate) returnVal += `\nClimate: ${ planet.climate }`;
      if (planet.system) returnVal += `\nCapital: ${ planet.capital }`;
      if (planet.inhabitants) returnVal += `\nInhabitants: ${ _.join(planet.inhabitants.sort(), ', ') }`;
      if (!!planet.alignment && !!planet.alignment.length) returnVal += `\nAlignment: ${ _.join(planet.alignment.sort(), ', ') }`;
      if (!!planet.hyperspace && !!planet.hyperspace.length) {
        returnVal += `\nConnected Planets: `;
        _.sortBy(planet.hyperspace, (h) => {
          return h.planet
        }).forEach((h, i) => {
          returnVal += h.planet;
          if (i !== planet.hyperspace.length - 1) {
            returnVal += ', ';
          }
        });
      } else {
        let planets = '';
        const arr = _.filter(this.nodes, (n) => {
          let hasHyperspace = false;
          try {
            hasHyperspace = !!_.find(n.hyperspace, ['planet', planet.name]);
          } catch(e) {
            return false;
          }
          return hasHyperspace;
        });
        if (!!arr.length) {
          planets += '\nConnected Planets: ';
          arr.forEach((p, i) => {
            planets += p.name;
            if (i !== arr.length - 1) {
              planets += ', ';
            }
          });
        }
        returnVal += planets;
      }
    } catch(e) {
      return PlanetBot.error(e);
    }
    return returnVal;
  }

  private listPlanets(): string {
    let planets = '**All Planets:** ';
    this._nodes.forEach((p, index) => {
      planets += p.name;
      if (index !== this._nodes.length - 1) {
        planets += ', ';
      }
    });
    return planets;
  }

  private static error(e: Error): string {
    return `Sincerest apologies, master, but I am afraid I ran into an error processing your request. The error has been logged. 
      \`\`\`
      ${ e.message }
      \`\`\``;
  }
}
