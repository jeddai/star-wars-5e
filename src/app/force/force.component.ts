import { Component, OnInit } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/primeng';

import { Discipline } from './Discipline';
import { Ability } from './Ability';
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
}
