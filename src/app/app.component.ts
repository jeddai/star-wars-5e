import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/primeng';

import fontawesome from '@fortawesome/fontawesome';
import light from '@fortawesome/fontawesome-pro-light';
import brands from '@fortawesome/fontawesome-free-brands';

fontawesome.library.add(light, brands);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';
  items: MenuItem[];

  constructor(private _router: Router) {}

  ngOnInit() {
    this.items = [
        {label: 'Stats', icon: 'fa-bar-chart'},
        {label: 'Calendar', icon: 'fa-calendar'},
        {label: 'Documentation', icon: 'fa-book'},
        {label: 'Support', icon: 'fa-support'},
        {label: 'Social', icon: 'fa-twitter'}
    ];
  }

  isActive(url): boolean {
    return this._router.url.includes(url);
  }
}
