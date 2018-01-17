import * as _ from 'lodash';

export class Skills {
  constructor() {
    this.athletics = null;
    this.acrobatics = null;
    this.sleight_of_hand = null;
    this.stealth = null;
    this.demolitions = null;
    this.history = null;
    this.investigation = null;
    this.nature = null;
    this.religion = null;
    this.repair = null;
    this.security = null;
    this.arcana = null;
    this.animal_handling = null;
    this.insight = null;
    this.medicine = null;
    this.perception = null;
    this.survival = null;
    this.deception = null;
    this.intimidation = null;
    this.performance = null;
    this.persuasion = null;
  }

  athletics: number
  acrobatics: number
  sleight_of_hand: number
  stealth: number
  demolitions: number
  history: number
  investigation: number
  nature: number
  religion: number
  repair: number
  security: number
  arcana: number
  animal_handling: number
  insight: number
  medicine: number
  perception: number
  survival: number
  deception: number
  intimidation: number
  performance: number
  persuasion: number

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

  public static ParseSkills(obj: Skills): Skills {
    var ascores: Skills = new Skills();
    for(var key in obj) {
      ascores[key] = obj[key];
    }
    return ascores;
  }
}