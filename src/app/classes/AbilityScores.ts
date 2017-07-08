import * as _ from 'lodash';

export class AbilityScores {
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number

  constructor() {
    this.strength = null;
    this.dexterity = null;
    this.constitution = null;
    this.intelligence = null;
    this.wisdom = null;
    this.charisma = null;
  }

  public print(): string {
    var printed: string = '';
    _.forOwn(this, function(value, key) {
      if(value)
        printed += _.capitalize(key) + ": " + (value > 0 ? "+" + value : value) + "; ";
    });
    return printed;
  }

  public isEmpty(): boolean {
    var bool = true;
    _.forOwn(this, function(value, key) {
      if(!!value) bool = false;
    });
    return bool;
  }

  public static MakeScores(str: number, dex: number, con: number, int: number, wis: number, cha: number): AbilityScores {
    var ascores: AbilityScores = new AbilityScores();
    ascores.strength = str;
    ascores.dexterity = dex;
    ascores.constitution = con;
    ascores.intelligence = int;
    ascores.wisdom = wis;
    ascores.charisma = cha;
    return ascores;
  }

  public static ParseScores(obj: AbilityScores): AbilityScores {
    var ascores: AbilityScores = new AbilityScores();
    for(var key in obj) {
      ascores[key] = obj[key];
    }
    return ascores;
  }

  public static GetScore(num: number): number {
    var x: number = (num - 10) / 2;
    if(x < 0)
      return _.ceil(x);
    else
      return _.floor(x);
  }
}