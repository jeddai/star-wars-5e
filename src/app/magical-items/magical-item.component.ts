import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import * as _ from 'lodash';

import { MagicalItem } from '../_interfaces';
import { MagicalItemService } from './magical-item.service';
import { FilterService } from '../_services/filter.service';

@Component({
  selector: 'app-magical-item',
  templateUrl: './magical-item.component.html',
  styleUrls: ['./magical-item.component.scss']
})
export class MagicalItemComponent implements OnInit {
  _ = _;
  items: MagicalItem[];
  stacked;
  attunementOptions: SelectItem[] = [{
      label: 'All',
      value: null
    }, {
      label: 'Required',
      value: true
    }, {
      label: 'Not Required',
      value: false
    }
  ];
  colors = {
    uncommon: '#0c0',
    rare: '#03c',
    'very rare': '#0cf',
    legendary: '#c0c',
    artifact: '#c90'
  };
  limit = 15;
  pages = 0;
  page = 0;
  filter = '';
  filterOptions: string[] = ['name', 'rarity', 'type', 'attunement', 'notes', 'tags'];

  constructor(private magicalItemService: MagicalItemService, private filterService: FilterService) { }

  ngOnInit() {
    this.magicalItemService
    .GetMagicItems()
    .then((res) => {
      this.items = res.Response;
      this.setPages(this.items);
    })
    .catch(e => console.log(e));
  }

  pagedItems(): MagicalItem[] {
    const filtered = this.filterService.filterArray(this.items, this.filter);
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
