import { Component, Input, OnInit } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/primeng';
import * as _ from 'lodash';

import { AbilityScores, Monster } from '../_classes';
import { MonsterManualService } from '../monster-manual/monster-manual.service';

@Component({
  selector: 'app-monster',
  templateUrl: './monster.component.html',
  styleUrls: ['./monster.component.css']
})
export class MonsterComponent implements OnInit {
  _ = _;
  ascores: string[] = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']

  @Input() monster: Monster;
  @Input() size;

  constructor(public monsterManualService: MonsterManualService) { }

  ngOnInit() {
    if (!this.size) {
      this.size = { 'font_size': 14 }
    }
  }

  public score(num: number): number {
    return AbilityScores.GetScore(num);
  }
}
