import { Component, OnInit, ViewChild, ApplicationRef } from '@angular/core';
import { SelectItem, MenuItem } from 'primeng/primeng';
import * as _ from 'lodash';

import { AbilityScores } from '../classes/AbilityScores';
import { Combat } from '../classes/Combat';
import { CRSelectItem } from '../classes/CRSelectItem';
import { Monster } from '../classes/Monster';
import { Combatant } from '../classes/Combatant';
import { MonsterManualService } from '../monster-manual/monster-manual.service';
import {Difficulty} from "../classes/Difficulty";

@Component({
  selector: 'app-combat',
  templateUrl: './combat.component.html',
  styleUrls: ['./combat.component.css']
})
export class CombatComponent implements OnInit {
  _ = _;
  monsterOptions: SelectItem[] = [{ label: 'None', value: null }, { label: 'Custom', value: Monster.MakeMonster(new Monster()) }];
  items: MenuItem[] = [
    {label: 'Edit Clone', icon: 'fa-edit', command: (event) => this.edit(_.cloneDeep(this.selectedObject))},
    {label: 'Copy', icon: 'fa-copy', command: (event) => this.copy(this.selectedObject)},
    {label: 'Delete', icon: 'fa-close', command: (event) => this.remove(this.selectedObject)}
  ];
  stacked;
  crItems: CRSelectItem[] = Combat.ChallengeRatings;
  levelItems: CRSelectItem[] = _.concat(Combat.ChallengeRatings[0], Combat.ChallengeRatings.slice(5, 25));
  monsters: Monster[];
  diff: Difficulty = {} as Difficulty;
  newMonster: Monster;
  newPlayer: Combatant;
  selectedObject: (Monster|Combatant);
  dialogVisible = false;
  tracker: number;
  encounter: (Monster|Combatant)[] = [];
  roll = {
    hp: false,
    init: false
  };

  @ViewChild('dt') table;

  constructor( public monsterManualService: MonsterManualService) {}

  ngOnInit() {
    this.monsterManualService
    .GetMonsters()
    .then((res) => {
      this.monsters = res.Response;
      this.monsters.forEach((m, i) => {
        this.monsterOptions.push({ label: m.name, value: m });
      });
    })
    .catch(e => console.log(e));
    this.getState();
    this.getDifficulty();
    this.initNewPlayer();

    this.crItems[0].label = 'Select';
    this.levelItems[0].label = 'Select';
  }

  public addMonster(name: string) {
    this.monsterManualService.GetMonster(name)
    .then((res) => {
      const monster: Monster = Monster.MakeMonster(res.Response);
      this.addMonsterSync(monster);
    })
    .catch(e => console.log(e));
    // this.addMonster('acklay', true, true);
  }

  public addMonsterSync(monster: Monster) {
    if (this.roll.init) {
      monster.initiative = _.random(1, 20) + AbilityScores.GetScore(monster.ability_scores.dexterity);
    } else if (!monster.initiative) {
      monster.initiative = 0;
    }
    if (this.roll.hp) {
      monster.current_hit_points = this.monsterManualService.RollHP(monster);
    } else if (!monster.current_hit_points) {
      monster.current_hit_points = this.monsterManualService.GetHP(monster);
    }
    monster.name = this.checkEncounterForConflicts(monster.name);
    this.encounter.push(_.cloneDeep(monster));
    this.newMonster = null;
    this.saveState();
  }

  public addPlayer(player: Combatant) {
    this.encounter.push(_.cloneDeep(player));
    this.initNewPlayer(player.challenge);
    this.saveState();
  }

  private copy(combatant: (Combatant|Monster)) {
    combatant = _.cloneDeep(combatant);
    combatant.name = this.checkEncounterForConflicts(combatant.name);
    this.encounter.push(combatant);
    this.saveState();
  }

  private edit(combatant: (Combatant|Monster)) {
    if (this.isMonster(combatant)) {
      this.newMonster = <Monster>combatant;
    } else {
      this.newPlayer = <Combatant>combatant;
    }
  }

  public toggleRow(event: any) {
    if (!!event.data && !!event.data.ability_scores && Monster.IsMonster(event.data)) {
      this.table.toggleRow(event.data);
    }
  }

  public saveState(): void {
    localStorage.setItem('encounter', JSON.stringify(this.encounter));
    this.getDifficulty();
  }

  public monsterValid(monster: Monster): boolean {
    return !!monster.name;
  }

  public isMonster(monster: (Monster | Combatant)): boolean {
    return Monster.IsMonster(monster);
  }

  public getDifficulty() {
    const threshold = {
      easy: 0,
      medium: 0,
      hard: 0,
      deadly: 0
    };
    let xp = 0;
    let numMonsters = 0;
    let numPlayers = 0;
    let diff = '';
    let pxp = 0;
    let maxCr = 0;

    function getChallengeNumber(challenge: string | number) {
      try {
        return +challenge;
      } catch(e) {
        if(challenge === '1/2') return 0.5;
        if(challenge === '1/4') return 0.25;
        if(challenge === '1/8') return 0.125;
      }
    }

    this.encounter.forEach((c) => {
      if (Monster.IsMonster(c)) {
        if(getChallengeNumber(c.challenge) > maxCr) maxCr = getChallengeNumber(c.challenge);
      }
    });

    this.encounter.forEach((c) => {
      if (Monster.IsMonster(c)) {
        xp += Combat.ChallengeRatings[_.findIndex(Combat.ChallengeRatings, (cr) => cr.label == c.challenge)].xp;
        if(getChallengeNumber(c.challenge) + 5 > maxCr) {
          numMonsters += 1;
        }
      } else {
        threshold.easy += Combat.XPThresholds[c.challenge].easy;
        threshold.medium += Combat.XPThresholds[c.challenge].medium;
        threshold.hard += Combat.XPThresholds[c.challenge].hard;
        threshold.deadly += Combat.XPThresholds[c.challenge].deadly;
        numPlayers += 1;
      }
    });
    xp *= Combat.GetMonsterMultiplier(numMonsters, numPlayers);
    diff = xp < threshold.easy ? 'Trivial' : xp < threshold.medium ? 'Easy' : xp < threshold.hard ? 'Medium' : xp < threshold.deadly ? 'Hard' : 'Deadly';
    pxp = xp < threshold.easy ? 0 : xp < threshold.medium ? threshold.easy : xp < threshold.hard ? threshold.medium : xp < threshold.deadly ? threshold.hard : threshold.deadly;
    this.diff = { xp: xp, pxp: pxp, diff: diff };
  }

  public initNewPlayer(num?: number) {
    this.newPlayer = new Combatant();
  }

  public initNewMonster() {
    this.newMonster = Monster.MakeMonster(new Monster());
  }

  private remove(obj: (Monster|Combatant)) {
    this.encounter = _.remove(this.encounter, (e) => {
      return !_.eq(e, obj);
    });
    this.saveState();
  }

  private getState(): void {
    this.encounter = !!localStorage.encounter ? JSON.parse(localStorage.encounter) : [Combatant.MakeCombatant('Person', 15, 50, 5, 15)];
    this.encounter.forEach((c, i) => {
      if (Monster.IsMonster(c)) {
        this.encounter[i] = Monster.MakeMonster(c);
      }
    })
  }

  private checkEncounterForConflicts(name: string): string {
    let conflictIndex =  _.findIndex(this.encounter, ({ 'name': name }));
    if (conflictIndex !== -1) {
      name = _.trim(name, ' 1234567890') + ' ' + (parseInt(this.encounter[conflictIndex].name.substr(-1), 10) + 1 || 1);
    }
    return name;
  }
}
