import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

import { Class, Race } from '../_interfaces';
import { Player } from '../_classes';
import { CharacterCreatorService } from './character-creator.service';

@Component({
  selector: 'app-character-creator',
  templateUrl: './character-creator.component.html',
  styleUrls: ['./character-creator.component.css']
})
export class CharacterCreatorComponent implements OnInit {

  active: number = 0;
  limit: number = 7;
  collapsed: boolean[];

  selected: Player = {
    race: {} as Race
  };

  constructor(public characterCreatorService: CharacterCreatorService) {}

  ngOnInit() {
    this.collapsed = [];
    for(let i = 0; i < this.limit; i++) {
      if(this.active === i) this.collapsed.push(false);
      else this.collapsed.push(true);
    }
  }

  public next() {
    this.collapsed[this.active] = true;
    if(this.active < this.limit - 1) this.active += 1;
    this.collapsed[this.active] = false;
  }

  public previous() {
    this.collapsed[this.active] = true;
    if(this.active > 0) this.active -= 1;
    this.collapsed[this.active] = false;
  }
}
