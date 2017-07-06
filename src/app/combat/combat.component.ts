import { Component, OnInit, ViewChild, ApplicationRef } from '@angular/core';
import { SelectItem, MenuItem } from 'primeng/primeng';
import * as _ from 'lodash';

import { AbilityScore } from '../classes/AbilityScore';
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
  monsterOptions: SelectItem[] = [{ label: 'None', value: null }, { label: 'Custom', value: Monster.GetEmptyMonster() }];
  items: MenuItem[] = [
    {label: 'Delete', icon: 'fa-close', command: (event) => this.remove(this.selectedObject)}
  ];

  @ViewChild("dt") table;
  monsters: Monster[];
  newMonster: Monster;
  newPlayer: Combatant;
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

    this.initNewPlayer();
  }

  private initNewPlayer() {
    this.newPlayer = {
      name: '',
      armor_class: null,
      current_hit_points: null,
      challenge: null,
      initiative: null
    }
  }

  private remove(obj: (Monster|Combatant)) {
    this.encounter = _.remove(this.encounter, (e) => {
      return !_.eq(e, obj);
    });
    this.saveState();
  }

  public addMonster(name: string, rollInitiative: boolean, rollHP: boolean) {
    this.monsterManualService.GetMonster(name)
    .then((res) => {
      var monster: Monster = new Monster(res.Response);
      this.addMonsterSync(monster, rollInitiative, rollHP);
    })
    .catch(e => console.log(e));
    //this.addMonster('acklay', true, true);
  }

  public addMonsterSync(monster: Monster, rollInitiative: boolean, rollHP: boolean) {
    console.log(monster);
    if(rollInitiative) {
      monster.initiative = _.random(1, 20) + AbilityScore.GetScore(monster.ability_scores.dex);
    } else {
      monster.initiative = 0;
    }
    if(rollHP) {
      monster.current_hit_points = this.monsterManualService.RollHP(monster);
    } else {
      monster.current_hit_points = this.monsterManualService.GetHP(monster);
    }
    // if(this.encounter.)
    this.encounter.push(monster);
    this.newMonster = null;
    this.saveState();
  }

  public addPlayer(player: Combatant) {
    this.encounter.push(player);
    this.saveState();
  }

  public toggleRow(event: any) {
    if(!!event.data && !!event.data.ability_scores && !(event.data instanceof Monster))
      this.table.toggleRow(event.data);
  }

  public saveState(): void {
    localStorage.setItem('encounter', JSON.stringify(this.encounter));
  }

  private getState(): void {
    this.encounter = !!localStorage.encounter ? JSON.parse(localStorage.encounter) : [new Combatant('Person', 15, 50, 5, 15)];
  }

  public monsterValid(monster: Monster): boolean {
    return !!monster.name;
  }
}
