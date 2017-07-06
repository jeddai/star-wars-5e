import { Component, OnInit } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/primeng';

import { MagicalItem } from '../classes/MagicalItem';
import { MagicalItemService } from './magical-item.service';

@Component({
  selector: 'magical-item',
  templateUrl: './magical-item.component.html',
  styleUrls: ['./magical-item.component.css']
})
export class MagicalItemComponent implements OnInit {
  constructor(private magicalItemService : MagicalItemService) { }
  
  items: MagicalItem[];
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
    artifact: '#c90'
  }

  ngOnInit() {
    this.magicalItemService
    .GetMagicItems()
    .then((res) => {
      this.items = res.Response;
    })
    .catch(e => console.log(e));
  }
}
