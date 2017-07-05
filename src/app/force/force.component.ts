import { Component, OnInit } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/primeng';

import { Discipline } from '../classes/Discipline';
import { Ability } from '../classes/Ability';
import { ForceService } from './force.service';

@Component({
  selector: 'force',
  templateUrl: './force.component.html',
  styleUrls: ['./force.component.css']
})
export class ForceComponent implements OnInit {
  constructor(private forceService : ForceService) { }
  
  disciplines: Discipline[];
  abilities: Ability[];

  items: MenuItem[];
  activeItem: MenuItem;
  selectDisciplines: SelectItem[] = [];
  selectedDisciplines: string[] = ['Adaptive Body'];

  castingTimeOptions: SelectItem[] = [{
      label: 'All',
      value: null
    }, {
      label:'Action', 
      value: 'action'
    }, {
      label:'Bonus Action',
      value: 'bonus'
    }, {
      label:'Instant',
      value: 'instant'
    }, {
      label:'Reaction',
      value: 'reaction'
    }
  ];

  rangeOptions: SelectItem[] = [{
      label: 'All',
      value: null
    }, {
      label:'30ft',
      value: '30ft'
    }, {
      label:'60ft',
      value: '60ft'
    }, {
      label:'90ft',
      value: '90ft'
    }, {
      label:'120ft',
      value: '120ft'
    }, {
      label:'Telepathy',
      value: 'telepathy'
    }, {
      label:'Touch',
      value: 'touch'
    }, {
      label:'Sight',
      value: 'sight'
    }
  ];

  ngOnInit() {
    this.forceService
    .GetDisciplines()
    .then((res) => {
      this.disciplines = res.Response;
      var abilities: Ability[] = [];
      var disciplines = [];
      for(let d of this.disciplines) {
        disciplines.push({ label:d.name, value:d.name });
        for(let a of d.abilities) {
          abilities.push(a);
        }
      }
      this.abilities = abilities;
      this.selectDisciplines = disciplines;
    })
    .catch(e => console.log(e));

    this.selectedDisciplines = !!localStorage.disciplines ? localStorage.disciplines.split(',') : ['Adaptive Body'];

    this.items = [
      {label: 'Select Disciplines', icon: 'fa-list-ol', command: () => {
        this.activeItem = 'selector';
      }},
      {label: 'Ability Table', icon: 'fa-bar-chart', command: () => {
        this.activeItem = 'table';
      }}
    ];

    this.activeItem = 'selector';
  }

  public saveSelectedDisciplines(): void {
    localStorage.setItem('disciplines', this.selectedDisciplines.toString());
  }
}
