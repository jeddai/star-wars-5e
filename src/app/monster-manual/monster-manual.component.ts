import { Component, OnInit } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/primeng';

import { Monster } from '../classes/Monster';
import { MonsterManualService } from './monster-manual.service';

@Component({
  selector: 'magical-item',
  templateUrl: './magical-item.component.html',
  styleUrls: ['./magical-item.component.css']
})
export class MonsterManualComponent implements OnInit {
  constructor(private monsterManualService : MonsterManualService) { }
  
  attunementOptions: SelectItem[] = [{
      label: 'All',
      value: null
    }, {
      label:'Required', 
      value:true
    }, {
      label:'Not Required',
      value:false
    }
  ];
  colors = {
    uncommon: '#0c0',
    rare: '#03c',
    "very rare": '#0cf',
    legendary: '#c0c',
    artifact: '#f0f'
  }

  ngOnInit() {
    this.monsterManualService
    .GetMagicItems()
    .then((res) => {
      
    })
    .catch(e => console.log(e));
  }
}
