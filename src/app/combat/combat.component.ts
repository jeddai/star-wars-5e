import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
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
  monsterOptions: SelectItem[] = [{ label: 'None', value: null }, { label: 'Custom', value: <Monster>{} }];
  
  @ViewChild("dt") table;
  monsters: Monster[];
  selectedMonster: SelectItem;
  dialogMonster: Monster;
  dialogVisible: boolean = false;
  tracker: number;
  enemies: Monster[] = [];
  players: Combatant[] = [];

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
    this.enemies.push(monster);
    this.saveState();
  }

  public addPlayer(player: Combatant) {

  }

  public toggleRow(event: any) {
    if(!!event.data && !!event.data.ability_scores && !event.originalEvent.target.classList.contains("ui-editable-column"))
      this.table.toggleRow(event.data);
  }

  public saveState(): void {
    localStorage.setItem('enemies', JSON.stringify(this.enemies));
    localStorage.setItem('players', JSON.stringify(this.players));
  }

  private getState(): void {
    this.players = !!localStorage.players ? JSON.parse(localStorage.players) : [new Combatant('Person', 15, 50, 5, 15)];
    this.enemies = !!localStorage.enemies ? JSON.parse(localStorage.enemies) : [];
  }

  public monsterValid(monster: Monster): boolean {
    return !!monster.name;
  }
}
