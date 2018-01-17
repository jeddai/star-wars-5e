import { Component, Input, OnInit } from '@angular/core';

import { Monster } from '../_classes';
import { MonsterManualService } from '../monster-manual/monster-manual.service';

@Component({
  selector: 'app-monster-overlay',
  templateUrl: './monster-overlay.component.html',
  styleUrls: ['./monster-overlay.component.css']
})
export class MonsterOverlayComponent implements OnInit {
  monster: Monster = new Monster();
  @Input('monster-string') monsterString: string;
  @Input() text: string;

  constructor(private monsterManualService : MonsterManualService) { }

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
