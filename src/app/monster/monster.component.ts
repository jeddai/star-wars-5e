import { Component, Input, OnInit } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/primeng';
import * as _ from 'lodash';

import { AbilityScores } from '../classes/AbilityScores';
import { CRSelectItem } from '../classes/CRSelectItem';
import { Monster } from '../classes/Monster';
import { MonsterManualService } from '../monster-manual/monster-manual.service';

@Component({
  selector: 'monster',
  templateUrl: './monster.component.html',
  styleUrls: ['./monster.component.css']
})
export class MonsterComponent {
  constructor(private monsterManualService : MonsterManualService) { }

  _=_;
  ascores = ['strength','dexterity','constitution','intelligence','wisdom','charisma']

  @Input() monster: Monster;
  @Input() size = {
    'font_size': 14
  }

  public print(scores: AbilityScores): string {
    console.log(scores);
    return scores.print();
  }

  public score(num: number): number {
    return AbilityScores.GetScore(num);
  }
}
