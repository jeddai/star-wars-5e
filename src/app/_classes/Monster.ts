import * as _ from 'lodash';

import { MonsterAbility, MonsterAction } from '../_interfaces';
import { AbilityScores, Skills } from '../_classes';

export class Monster {
  constructor() {
    let monster: Monster = <Monster>{};
    monster.name = '';
    monster.size = '';
    monster.type = '';
    monster.alignment = '';
    monster.armor_class = null;
    monster.hit_points = null;
    monster.speed = ''
    monster.ability_scores = new AbilityScores();
    monster.saving_throws = new AbilityScores();
    monster.skills = new Skills();
    monster.damage_vulnerabilities = ''
    monster.damage_resistances = ''
    monster.damage_immunities = ''
    monster.condition_immunities = ''
    monster.senses = ''
    monster.languages = ''
    monster.challenge = ''
    monster.special_abilities = []
    monster.actions = []
    monster.legendary_actions = []
    monster.from = ''
  }

  name: string = ''
  size: string = ''
  type: string = ''
  subtype: string = ''
  alignment: string = ''
  armor_class: number = null
  hit_points: number = null
  current_hit_points: number = null
  speed: string = ''
  ability_scores: AbilityScores = null
  saving_throws: AbilityScores = null
  skills: Skills = null;
  damage_vulnerabilities: string = ''
  damage_resistances: string = ''
  damage_immunities: string = ''
  condition_immunities: string = ''
  senses: string = ''
  languages: string = ''
  challenge: string = ''
  special_abilities: MonsterAbility[] = []
  actions: MonsterAction[] = []
  legendary_actions: MonsterAbility[] = []
  initiative: number = null;
  from: string = ''

  public static MakeMonster(monster: any): Monster {
    let newMonster: Monster = new Monster();
    _.forIn(newMonster, function(value, key) {
      newMonster[key] = monster[key];
    });
    newMonster.ability_scores = AbilityScores.ParseScores(newMonster.ability_scores);
    newMonster.saving_throws = AbilityScores.ParseScores(newMonster.saving_throws);
    newMonster.skills = Skills.ParseSkills(newMonster.skills);
    return newMonster;
  }

  public static SetMonsterFromSRD(obj: any): Monster {
    let monster: Monster = <Monster>{};
    monster.name = obj.name;
    monster.size = _.lowerCase(obj.size);
    monster.type = obj.type;
    monster.subtype = obj.subtype;
    monster.alignment = obj.alignment;
    monster.armor_class = obj.armor_class;
    monster.hit_points = obj.hit_dice.slice(0, obj.hit_dice.indexOf('d'));
    monster.speed = obj.speed;
    monster.ability_scores = AbilityScores.MakeScores(obj.strength, obj.dexterity, obj.constitution, obj.intelligence, obj.wisdom, obj.charisma);
    monster.saving_throws = AbilityScores.MakeScores(
      !!obj.strength_save ? obj.strength_save : null,
      !!obj.dexterity_save ? obj.dexterity_save : null,
      !!obj.constitution_save ? obj.constitution_save : null,
      !!obj.intelligence_save ? obj.intelligence_save : null,
      !!obj.wisdom_save ? obj.wisdom_save : null,
      !!obj.charisma_save ? obj.charisma_save : null,
    );
    monster.skills = new Skills();
    for(let key in monster.skills) {
      monster.skills[key] = !!obj[key] ? obj[key] : null;
    }
    monster.damage_vulnerabilities = obj.damage_vulnerabilities;
    monster.damage_resistances = obj.damage_resistances;
    monster.damage_immunities = obj.damage_immunities;
    monster.condition_immunities = obj.condition_immunities;
    monster.senses = obj.senses;
    monster.languages = obj.languages;
    monster.challenge = obj.challenge_rating;
    monster.special_abilities = obj.special_abilities;
    monster.actions = obj.actions;
    monster.legendary_actions = obj.legendary_actions;
    return monster;
  }

  public static IsMonster(obj): boolean {
    return obj.hasOwnProperty('ability_scores');
  }
}
