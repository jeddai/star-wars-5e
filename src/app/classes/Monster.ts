import { AbilityScore } from './AbilityScore';
import { MonsterAbility } from './MonsterAbility';
import { MonsterAction } from './MonsterAction';
import { MonsterManualService } from '../monster-manual/monster-manual.service';

export class Monster {
  constructor(monster: Monster) {
    this.name = monster.name;
    this.size = monster.size;
    this.type = monster.type;
    this.alignment = monster.alignment;
    this.armor_class = monster.armor_class;
    this.hit_points = monster.hit_points;
    this.speed = monster.speed;
    this.environment = monster.environment;
    this.planet = monster.planet;
    this.ability_scores = monster.ability_scores;
    this.saving_throws = monster.saving_throws;
    this.skills = monster.skills;
    this.damage_vulnerabilities = monster.damage_vulnerabilities;
    this.damage_resistances = monster.damage_resistances;
    this.damage_immunities = monster.damage_immunities;
    this.condition_immunities = monster.condition_immunities;
    this.senses = monster.senses;
    this.languages = monster.languages;
    this.challenge = monster.challenge;
    this.others = monster.others;
    this.abilities = monster.abilities;
    this.actions = monster.actions;
    this.legendary_actions = monster.legendary_actions;
    this.initiative = monster.initiative;
  }

  name: string = ''
  size: string = ''
  type: string = ''
  alignment: string = ''
  armor_class: number = 0
  hit_points: number = 0
  current_hit_points: number = 0
  speed: string[] = []
  environment: string[] = []
  planet: string[] = []
  ability_scores: AbilityScore = null
  saving_throws: string[] = []
  skills: string[] = []
  damage_vulnerabilities: string[] = []
  damage_resistances: string[] = []
  damage_immunities: string[] = []
  condition_immunities: string[] = []
  senses: string[] = []
  languages: string[] = []
  challenge: number = 0
  others: MonsterAbility[] = []
  abilities: MonsterAbility[] = []
  actions: MonsterAction[] = []
  legendary_actions: MonsterAction[] = []
  initiative: number = 0

  public static GetEmptyMonster(): Monster {
    var monster:Monster = <Monster>{};
    monster.name = '';
    monster.size = '';
    monster.type = '';
    monster.alignment = '';
    monster.armor_class = null;
    monster.hit_points = null;
    monster.speed = [];
    monster.environment = [];
    monster.planet = [];
    monster.ability_scores = {
      str: null,
      dex: null,
      con: null,
      int: null,
      wis: null,
      cha: null
    };
    monster.saving_throws = [];
    monster.skills = [];
    monster.damage_vulnerabilities = [];
    monster.damage_resistances = [];
    monster.damage_immunities = [];
    monster.condition_immunities = [];
    monster.senses = [];
    monster.languages = [];
    monster.challenge = null;
    monster.others = [];
    monster.abilities = [];
    monster.actions = [];
    monster.legendary_actions = [];
    monster.initiative = null;
    return monster;
  }
}