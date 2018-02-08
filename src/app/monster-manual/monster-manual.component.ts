import { Component, OnInit } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/primeng';
import * as _ from 'lodash';

import { AbilityScores, Monster } from '../_classes';
import { MonsterManualService } from './monster-manual.service';
import { FilterService } from '../_services/filter.service';

@Component({
  selector: 'app-monster-manual',
  templateUrl: './monster-manual.component.html',
  styleUrls: ['./monster-manual.component.scss']
})
export class MonsterManualComponent implements OnInit {
  monsters: Monster[];
  _ = _;
  stacked;
  ascores = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
  sizeFilter: SelectItem[] = [{ label: 'All', value: null }, { label: 'Tiny', value: 'tiny' },
    { label: 'Small', value: 'small' }, { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' }, { label: 'Huge', value: 'huge' },
    { label: 'Gargantuan', value: 'gargantuan' }];
  alignmentFilter: SelectItem[] = [{ label: 'All', value: null }];
  limit = 30;
  pages = 0;
  page = 0;
  filter = '';
  filterOptions: string[] = ['name', 'type', 'size', 'challenge', 'alignment', 'source'];

  constructor(public monsterManualService: MonsterManualService, private filterService: FilterService) { }

  ngOnInit() {
    this.monsterManualService
    .GetMonsters()
    .then((res) => {
      this.monsters = res.Response;
      this.setPages(this.monsters);
    })
    .catch(e => console.log(e));
  }

  public score(num: number): number {
    return AbilityScores.GetScore(num);
  }

  public pagedMonsters(): Monster[] {
    const filtered = this.filterService.filterArray(this.monsters, this.filter);
    this.setPages(filtered);
    if (this.page < 0) { this.page = 0; } else
    if (this.page >= this.pages) { this.page = this.pages - 1; }
    return _.take(_.drop(filtered, this.limit * this.page), this.limit);
  }

  private setPages(val: any[]) {
    const pages = _.ceil(val.length / this.limit);
    if (this.page >= pages) { this.page = pages - 1; }
    this.pages = pages;
  }
}
