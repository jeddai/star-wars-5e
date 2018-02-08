import { Component, Input, OnInit } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/primeng';
import * as _ from 'lodash';

import { AbilityScores, Monster } from '../_classes';
import { MonsterManualService } from '../monster-manual/monster-manual.service';

@Component({
  selector: 'app-monster',
  templateUrl: './monster.component.html',
  styleUrls: ['./monster.component.scss']
})
export class MonsterComponent implements OnInit {
  @Input() monster: Monster;
  @Input() size;
  _ = _;
  abilityScores: any[] = [{
    label: 'STR',
    name: 'strength'
  }, {
    label: 'DEX',
    name: 'dexterity'
  }, {
    label: 'CON',
    name: 'constitution'
  }, {
    label: 'INT',
    name: 'intelligence'
  }, {
    label: 'WIS',
    name: 'wisdom'
  }, {
    label: 'CHA',
    name: 'charisma'
  }]

  constructor(public monsterManualService: MonsterManualService) { }

  ngOnInit() {
    if (!this.size) {
      this.size = { 'font_size': 16 }
    }
  }

  public score(num: number): number {
    return AbilityScores.GetScore(num);
  }

  getAbilityScoreModifier(ability_score: string) {
    const mod = Math.floor((this.monster.ability_scores[ability_score] - 10) / 2);
    return {
      string: `${this.monster.ability_scores[ability_score]} (${ mod >= 0 ? '+' : '' }${mod})`,
      value: mod
    }
  }

  getChallengeRating(): string {
    if (this.monster.challenge === '0.5') { return '1/2'; }
    if (this.monster.challenge === '0.25') { return '1/4'; }
    if (this.monster.challenge === '0.125') { return '1/8'; }
    return `${this.monster.challenge}`
  }

  getHP(): string {
    const rolled = Math.ceil(((this.getHitDie() / 2) + 0.5) * this.monster.hit_points);
    const con = this.monster.hit_points * this.getAbilityScoreModifier('constitution').value;
    let str = `${rolled + con} (${this.monster.hit_points}d${this.getHitDie()}`;
    if (con !== 0) { str += `${getNumberWithPlus(con)}`; }
    str += ')';
    return str;
  }

  getHitDie(): number {
    if (this.monster.size === 'tiny') { return 4; }
    if (this.monster.size === 'small') { return 6; }
    if (this.monster.size === 'medium') { return 8; }
    if (this.monster.size === 'large') { return 10; }
    if (this.monster.size === 'huge') { return 12; }
    if (this.monster.size === 'gargantuan') { return 20; }
  }

  abilities(): any[] {
    if (!this.monster) { return []; }
    const abilities: any[] = [];
    const stats: any = {}
    const names = {
      'saving_throws': 'Saving Throws',
      'skills': 'Skills',
      'damage_vulnerabilities': 'Damage Vulnerabilities',
      'damage_resistances': 'Damage Resistances',
      'damage_immunities': 'Damage Immunities',
      'condition_immunities': 'Condition Immunities',
      'senses': 'Senses',
      'languages': 'Languages'
    }
    _.forEach(this.monster.saving_throws, (value, key) => {
      if (value && !stats.saving_throws) { stats.saving_throws = ''; }
      if (value) { stats.saving_throws += `${_.capitalize(key)} ${getNumberWithPlus(value)}; `; }
    });

    _.forEach(this.monster.skills, (value, key) => {
      if (value && !stats.skills) { stats.skills = ''; }
      if (value) { stats.skills += `${_.capitalize(key)} ${getNumberWithPlus(value)}; `; }
    });

    stats.damage_vulnerabilities = this.monster.damage_vulnerabilities;
    stats.damage_resistances = this.monster.damage_resistances;
    stats.damage_immunities = this.monster.damage_immunities;
    stats.condition_immunities = this.monster.condition_immunities;
    stats.senses = this.monster.senses;
    stats.languages = this.monster.languages;

    _.forEach(stats, (value, key) => {
      if (value) {
        abilities.push({
          name: names[key],
          value: value
        });
      }
    });
    return abilities;
  }

  actions(): any[] {
    const abilities = [{
      name: 'Special Abilities',
      property : 'special_abilities'
    }, {
      name: 'Actions',
      property: 'actions'
    }, {
      name: 'Legendary Actions',
      property: 'legendary_actions'
    }];
    const arr = [];
    _.forEach(abilities, ability => {
      if (this.monster[ability.property] && this.monster[ability.property].length) {
        arr.push({
          name: ability.name,
          value: this.monster[ability.property]
        });
      }
    });
    return arr;
  }
}

function getNumberWithPlus(num: number): string {
  return num > 0 ? `+${num}` : ``;
}
