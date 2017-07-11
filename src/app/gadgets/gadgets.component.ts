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
  levelOptions: SelectItem[] = [{label:'All',value:null},{label:'1',value:1},{label:'2',value:2},{label:'3',value:3},{label:'4',value:4}];

  ngOnInit() {
    this.gadgetsService
    .GetGadgets()
    .then((res) => {
      this.gadgets = res.Response;
    })
    .catch(e => console.log(e));
  }
}
