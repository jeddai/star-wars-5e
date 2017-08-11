import { Component, OnInit } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/primeng';
import * as _ from 'lodash';

import { AbilityScores, Monster } from 'contracts/classes';
import { MonsterManualService } from './monster-manual.service';

@Component({
  selector: 'app-monster-manual',
  templateUrl: './monster-manual.component.html',
  styleUrls: ['./monster-manual.component.css']
})
export class MonsterManualComponent implements OnInit {
  monsters: Monster[];
  _ = _;
  stacked;
  ascores = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
  sizeFilter: SelectItem[] = [{ label: 'All', value: null }, { label: 'Tiny', value: 'tiny' },
    { label: 'Small', value: 'small' }, { label: 'Medium', value: 'Medium' },
    { label: 'Large', value: 'large' }, { label: 'Huge', value: 'huge' },
    { label: 'Gargantuan', value: 'gargantuan' }];
  alignmentFilter: SelectItem[] = [{ label: 'All', value: null }];
  constructor(public monsterManualService: MonsterManualService) { }

  ngOnInit() {
    this.monsterManualService
    .GetMonsters()
    .then((res) => {
      this.monsters = res.Response;
    })
    .catch(e => console.log(e));
  }

  public score(num: number): number {
    return AbilityScores.GetScore(num);
  }
}
