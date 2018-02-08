import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

import { Ability, Discipline } from '../_interfaces';
import { ForceService } from './force.service';
import { FilterService } from '../_services/filter.service';

@Component({
  selector: 'app-force',
  templateUrl: './force.component.html',
  styleUrls: ['./force.component.scss']
})
export class ForceComponent implements OnInit {
  _ = _;
  disciplines: Discipline[];
  abilities: Ability[];
  view = 'abilities';
  stacked;
  selectedDisciplines: string[] = ['Adaptive Body'];
  limit = 15;
  pages = 0;
  page = 0;
  filter = '';
  filterOptions: string[] = ['name', 'discipline', 'order', 'cost', 'casting_time', 'duration'];

  constructor(private forceService: ForceService, private filterService: FilterService) { }

  ngOnInit() {
    this.forceService
    .GetDisciplines()
    .then((res) => {
      this.disciplines = res.Response;
      const abilities: Ability[] = [];
      const disciplines = [];
      for (const d of this.disciplines) {
        disciplines.push({ label: d.name, value: d.name });
        for (const a of d.abilities) {
          abilities.push(a);
        }
      }
      this.abilities = abilities;
    })
    .catch(e => console.log(e));

    this.selectedDisciplines = !!localStorage.disciplines ? localStorage.disciplines.split(',') : ['Adaptive Body'];
  }

  public saveSelectedDisciplines(): void {
    localStorage.setItem('disciplines', this.selectedDisciplines.toString());
  }

  pagedAbilities(): Discipline[] {
    const filtered = this.filterService.filterArray(this.abilities, this.filter);
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
