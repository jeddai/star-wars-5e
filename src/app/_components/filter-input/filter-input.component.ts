import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

import { FilterService } from '../../_services/filter.service';

@Component({
  selector: 'app-filter-input',
  templateUrl: './filter-input.component.html',
  styleUrls: ['./filter-input.component.scss']
})
export class FilterInputComponent implements OnInit {

  filterValue: string;
  @Output() filterChange = new EventEmitter();
  @Input() filterOptions: string[];
  placeholder: string;
  showSettings = false;

  constructor(public filterService: FilterService) { }

  ngOnInit() {
    this.filterOptions = this.filterOptions.sort();
    this.filterService.filterBy = this.filterOptions;
    this.setPlaceholder();
  }

  public active(filterOption: string) {
    return _.includes(this.filterService.filterBy, filterOption);
  }

  public toggle(filterOption: string) {
    if (_.includes(this.filterService.filterBy, filterOption)) {
      this.filterService.filterBy = _.filter(this.filterService.filterBy, (option) => {
        return filterOption !== option;
      }).sort();
    } else {
      this.filterService.filterBy.push(filterOption);
    }
    this.setPlaceholder();
  }

  private setPlaceholder() {
    this.placeholder = `Filters on ${this.filterService.filterBy.join(', ')}. Use ';' for multiple terms.`;
  }

  set filter(val) {
    this.filterValue = val;
    this.filterChange.emit(this.filterValue);
  }

  @Input()
  get filter() {
    return this.filterValue;
  }
}
