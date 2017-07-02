import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/primeng';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private _router:Router) {}
  title = 'app';
  items: MenuItem[];
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
