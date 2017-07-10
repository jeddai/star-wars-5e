import { Component, OnInit } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/primeng';
import * as _ from 'lodash';

import { Gadget } from '../classes/Gadget';
import { GadgetsService } from './gadgets.service';

@Component({
  selector: 'gadgets',
  templateUrl: './gadgets.component.html',
  styleUrls: ['./gadgets.component.css']
})
export class GadgetsComponent implements OnInit {
  constructor(private gadgetsService : GadgetsService) { }
  
  _=_;
  gadgets: Gadget[];
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
    this.gadgetsService
    .GetGadgets()
    .then((res) => {
      this.gadgets = res.Response;
    })
    .catch(e => console.log(e));
  }
}
