import { Component, Input, OnInit } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/primeng';
import * as _ from 'lodash';

import { Monster } from '../classes/Monster';
import { MonsterManualService } from '../monster-manual/monster-manual.service';

@Component({
  selector: 'monster-overlay',
  templateUrl: './monster-overlay.component.html',
  styleUrls: ['./monster-overlay.component.css']
})
export class MonsterOverlayComponent implements OnInit {
  constructor(private monsterManualService : MonsterManualService) { }

  _=_;

  monster: Monster = new Monster();
  @Input('monster-string') monsterString: string;
  @Input() text: string;

  ngOnInit() {
    this.monsterManualService.GetMonster(this.monsterString).then((res) => {
      this.monster = Monster.MakeMonster(res.Response);
    })
    .catch(e => console.log(e));
  }

  public show() {
    return !!this.monster.name;
  }
}
