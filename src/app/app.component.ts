import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/primeng';

import fontawesome from '@fortawesome/fontawesome';
import light from '@fortawesome/fontawesome-pro-light';
import brands from '@fortawesome/fontawesome-free-brands';
import { MonsterManualService } from './monster-manual/monster-manual.service';
import { MagicalItemService } from './magical-items/magical-item.service';
import { GadgetsService } from './gadgets/gadgets.service';
import { ForceService } from './force/force.service';
import { MapService } from './map/map.service';

fontawesome.library.add(light, brands);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';
  items: MenuItem[];

  constructor(private _router: Router, private monsterManualService: MonsterManualService, private magicalItemService: MagicalItemService,
              private gadgetsService: GadgetsService, private forceService: ForceService, private mapService: MapService) {}

  ngOnInit() {
    this.items = [
        {label: 'Stats', icon: 'fa-bar-chart'},
        {label: 'Calendar', icon: 'fa-calendar'},
        {label: 'Documentation', icon: 'fa-book'},
        {label: 'Support', icon: 'fa-support'},
        {label: 'Social', icon: 'fa-twitter'}
    ];

    this.forceService.GetDisciplines();
    this.gadgetsService.GetGadgets();
    this.magicalItemService.GetMagicItems();
    this.monsterManualService.GetMonsters();
    this.mapService.GetActivePlanets();
  }

  isActive(url): boolean {
    return this._router.url.includes(url);
  }
}
