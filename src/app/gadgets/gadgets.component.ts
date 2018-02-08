import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import * as _ from 'lodash';

import { Gadget } from '../_classes';
import { GadgetsService } from './gadgets.service';
import { FilterService } from '../_services/filter.service';

@Component({
  selector: 'app-gadgets',
  templateUrl: './gadgets.component.html',
  styleUrls: ['./gadgets.component.scss']
})
export class GadgetsComponent implements OnInit {
  _ = _;
  stacked;
  gadgets: Gadget[] = [];
  levelOptions: SelectItem[] = [{label: 'All', value: null}, {label: '1', value: 1},
    {label: '2', value: 2}, {label: '3', value: 3}, {label: '4', value: 4}];
  limit = 15;
  pages = 0;
  page = 0;
  filter = '';
  filterOptions: string[] = ['name', 'type', 'activation', 'level', 'restrictions', 'cost'];
  filterBy: string[] = this.filterOptions;

  constructor(private gadgetsService: GadgetsService, private filterService: FilterService) { }

  ngOnInit() {
    this.gadgetsService
    .GetGadgets()
    .then((res) => {
      this.gadgets = res.Response;
      this.setPages(this.gadgets);
    })
    .catch(e => console.log(e));
  }

  pagedGadgets(): Gadget[] {
    const filtered = this.filterService.filterArray(this.gadgets, this.filter);
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
