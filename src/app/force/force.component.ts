import { Component, OnInit } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/primeng';

import { Discipline } from '../classes/Discipline';
import { Ability } from '../classes/Ability';
import { ForceService } from './force.service';

@Component({
  selector: 'app-force',
  templateUrl: './force.component.html',
  styleUrls: ['./force.component.css']
})
export class ForceComponent implements OnInit {
  disciplines: Discipline[];
  abilities: Ability[];

  items: MenuItem[];
  stacked;
  activeItem: MenuItem;
  selectDisciplines: SelectItem[] = [];
  selectedDisciplines: string[] = ['Adaptive Body'];

  castingTimeOptions: SelectItem[] = [{
      label: 'All',
      value: null
    }, {
      label: 'Action',
      value: 'action'
    }, {
      label: 'Bonus Action',
      value: 'bonus'
    }, {
      label: 'Instant',
      value: 'instant'
    }, {
      label: 'Reaction',
      value: 'reaction'
    }
  ];

  rangeOptions: SelectItem[] = [{
      label: 'All',
      value: null
    }, {
      label: '30ft',
      value: '30ft'
    }, {
      label: '60ft',
      value: '60ft'
    }, {
      label: '90ft',
      value: '90ft'
    }, {
      label: '120ft',
      value: '120ft'
    }, {
      label: 'Telepathy',
      value: 'telepathy'
    }, {
      label: 'Touch',
      value: 'touch'
    }, {
      label: 'Sight',
      value: 'sight'
    }
  ];

  constructor(private forceService: ForceService) { }

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
      this.selectDisciplines = disciplines;
    })
    .catch(e => console.log(e));

    this.selectedDisciplines = !!localStorage.disciplines ? localStorage.disciplines.split(',') : ['Adaptive Body'];

    this.items = [
      { label: 'Select Disciplines', icon: 'fa-list-ol', command: () => {
        this.activeItem = this.items[0];
      }},
      { label: 'Ability Table', icon: 'fa-bar-chart', command: () => {
        this.activeItem = this.items[1];
      }}
    ];

    this.activeItem = this.items[0];
  }

  public saveSelectedDisciplines(): void {
    localStorage.setItem('disciplines', this.selectedDisciplines.toString());
  }
}
