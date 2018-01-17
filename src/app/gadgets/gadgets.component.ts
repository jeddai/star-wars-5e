import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import * as _ from 'lodash';

import { Gadget } from '../_classes';
import { GadgetsService } from './gadgets.service';

@Component({
  selector: 'app-gadgets',
  templateUrl: './gadgets.component.html',
  styleUrls: ['./gadgets.component.css']
})
export class GadgetsComponent implements OnInit {
  _= _;
  stacked;
  gadgets: Gadget[];
  levelOptions: SelectItem[] = [{label: 'All', value: null}, {label: '1', value: 1},
    {label: '2', value: 2}, {label: '3', value: 3}, {label: '4', value: 4}];

  constructor(private gadgetsService: GadgetsService) { }

  ngOnInit() {
    this.gadgetsService
    .GetGadgets()
    .then((res) => {
      this.gadgets = res.Response;
    })
    .catch(e => console.log(e));
  }
}
