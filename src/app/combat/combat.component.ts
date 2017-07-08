import { Component, OnInit, ViewChild, ApplicationRef } from '@angular/core';
import { SelectItem, MenuItem } from 'primeng/primeng';
import * as _ from 'lodash';

import { AbilityScores } from '../classes/AbilityScores';
import { Combat } from '../classes/Combat';
import { Monster } from '../classes/Monster';
import { Combatant } from '../classes/Combatant';
import { MonsterManualService } from '../monster-manual/monster-manual.service';

@Component({
  selector: 'combat',
  templateUrl: './combat.component.html',
  styleUrls: ['./combat.component.css']
})
export class CombatComponent implements OnInit {
  constructor( public monsterManualService: MonsterManualService) {}

  _=_;
  monsterOptions: SelectItem[] = [{ label: 'None', value: null }, { label: 'Custom', value: Monster.MakeMonster(new Monster()) }];
  items: MenuItem[] = [
    {label: 'Copy', icon: 'fa-copy', command: (event) => this.copy(this.selectedObject)},
    {label: 'Delete', icon: 'fa-close', command: (event) => this.remove(this.selectedObject)}
  ];

  @ViewChild("dt") table;
  monsters: Monster[];
  diff = {};
  newMonster: Monster;
  newPlayer: Combatant ;
  selectedObject: (Monster|Combatant)
  dialogVisible: boolean = false;
  tracker: number;
  encounter: (Monster|Combatant)[] = [];

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
  }

  public addMonster(name: string, rollInitiative: boolean, rollHP: boolean) {
    this.monsterManualService.GetMonster(name)
    .then((res) => {
      var monster: Monster = Monster.MakeMonster(res.Response);
      this.addMonsterSync(monster, rollInitiative, rollHP);
    })
    .catch(e => console.log(e));
    //this.addMonster('acklay', true, true);
  }

  public addMonsterSync(monster: Monster, rollInitiative: boolean, rollHP: boolean) {
    if(rollInitiative) {
      monster.initiative = _.random(1, 20) + AbilityScores.GetScore(monster.ability_scores.dexterity);
    } else {
      monster.initiative = 0;
    }
    if(rollHP) {
      monster.current_hit_points = this.monsterManualService.RollHP(monster);
    } else {
      monster.current_hit_points = this.monsterManualService.GetHP(monster);
    }
    this.encounter.push(_.cloneDeep(monster));
    this.newMonster = null;
    this.saveState();
  }

  public addPlayer(player: Combatant) {
    this.encounter.push(_.cloneDeep(player));
    this.initNewPlayer(player.challenge);
    this.saveState();
  }

  public copy(combatant: (Combatant|Monster)) {
    this.encounter.push(_.cloneDeep(combatant));
    this.saveState();
  }

  public toggleRow(event: any) {
    if(!!event.data && !!event.data.ability_scores && Monster.IsMonster(event.data))
      this.table.toggleRow(event.data);
  }

  public saveState(): void {
    localStorage.setItem('encounter', JSON.stringify(this.encounter));
    this.getDifficulty();
  }

  public monsterValid(monster: Monster): boolean {
    return !!monster.name;
  }

  public type(monster: (Monster | Combatant)): string {
    return Monster.IsMonster(monster) ? 'Monster' : 'Player';
  }

  public getDifficulty() {
    var threshold = {
      easy: 0,
      medium: 0,
      hard: 0,
      deadly: 0
    }
    var xp = 0;
    var numMonsters = 0;
    var diff = '';
    var pxp = 0;
    this.encounter.forEach((c) => {
      if(Monster.IsMonster(c)) {
        xp += Combat.ChallengeRatings[_.findIndex(Combat.ChallengeRatings, (cr) => { return cr.label == c.challenge; })].xp;
        numMonsters += 1;
      } else {
        threshold.easy += Combat.XPThresholds[c.challenge].easy;
        threshold.medium += Combat.XPThresholds[c.challenge].medium;
        threshold.hard += Combat.XPThresholds[c.challenge].hard;
        threshold.deadly += Combat.XPThresholds[c.challenge].deadly;
      }
    });
    xp *= Combat.GetMonsterMultiplier(numMonsters);
    diff = xp < threshold.easy ? 'Easy' : xp < threshold.medium ? 'Medium' : xp < threshold.hard ? 'Hard' : 'Deadly';
    pxp = xp < threshold.easy ? threshold.easy : xp < threshold.medium ? threshold.medium : xp < threshold.hard ? threshold.hard : threshold.deadly;
    this.diff = { xp: xp, pxp: pxp, diff: diff };
  }

  private initNewPlayer(num?: number) {
    this.newPlayer = {
      name: '',
      armor_class: null,
      current_hit_points: null,
      challenge: num || null,
      initiative: null
    }
  }

  private remove(obj: (Monster|Combatant)) {
    this.encounter = _.remove(this.encounter, (e) => {
      return !_.eq(e, obj);
    });
    this.saveState();
  }

  private getState(): void {
    this.encounter = !!localStorage.encounter ? JSON.parse(localStorage.encounter) : [new Combatant('Person', 15, 50, 5, 15)];
    this.encounter.forEach((c, i) => {
      if(Monster.IsMonster(c)) {
        this.encounter[i] = Monster.MakeMonster(c);
      }
    })
  }
}
