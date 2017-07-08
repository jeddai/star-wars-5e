import { Component, OnInit, ViewChild, ApplicationRef } from '@angular/core';
import { SelectItem, MenuItem } from 'primeng/primeng';
import * as _ from 'lodash';

import { AbilityScores } from '../classes/AbilityScores';
import { Combat } from '../classes/Combat';
import { CRSelectItem } from '../classes/CRSelectItem';
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
    {label: 'Edit', icon: 'fa-edit', command: (event) => this.edit(_.cloneDeep(this.selectedObject))},
    {label: 'Copy', icon: 'fa-copy', command: (event) => this.copy(this.selectedObject)},
    {label: 'Delete', icon: 'fa-close', command: (event) => this.remove(this.selectedObject)}
  ];
  crItems: CRSelectItem[] = Combat.ChallengeRatings;
  levelItems: CRSelectItem[] = _.concat(Combat.ChallengeRatings[0], Combat.ChallengeRatings.slice(5, 25));

  @ViewChild("dt") table;
  monsters: Monster[];
  diff = {};
  newMonster: Monster;
  newPlayer: Combatant;
  selectedObject: (Monster|Combatant)
  dialogVisible: boolean = false;
  tracker: number;
  encounter: (Monster|Combatant)[] = [];
  roll = {
    hp: false,
    init: false
  }

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
      var monster: Monster = Monster.MakeMonster(res.Response);
      this.addMonsterSync(monster);
    })
    .catch(e => console.log(e));
    //this.addMonster('acklay', true, true);
  }

  public addMonsterSync(monster: Monster) {
    if(this.roll.init) {
      monster.initiative = _.random(1, 20) + AbilityScores.GetScore(monster.ability_scores.dexterity);
    } else if(!monster.initiative) {
      monster.initiative = 0;
    }
    if(this.roll.hp) {
      monster.current_hit_points = this.monsterManualService.RollHP(monster);
    } else if(!monster.current_hit_points) {
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
    if(this.isMonster(combatant)) {
      this.newMonster = <Monster>combatant;
    } else {
      this.newPlayer = <Combatant>combatant;
    }
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

  public isMonster(monster: (Monster | Combatant)): boolean {
    return Monster.IsMonster(monster);
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

  public initNewPlayer(num?: number) {
    this.newPlayer = new Combatant();
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
      if(Monster.IsMonster(c)) {
        this.encounter[i] = Monster.MakeMonster(c);
      }
    })
  }

  private checkEncounterForConflicts(name: string): string {
    var conflictIndex =  _.findIndex(this.encounter, ({ 'name': name }));
    if(conflictIndex !== -1) {
      name = _.trim(name, '1234567890') + ' ' + (parseInt(this.encounter[conflictIndex].name.substr(-1), 10) + 1 || 1);
    }
    return name;
  }
}
