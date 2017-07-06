import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AccordionModule, ButtonModule, DataTableModule, DialogModule, DropdownModule, InputTextModule, MultiSelectModule, PanelModule, SharedModule, TabMenuModule } from 'primeng/primeng';

import { AppComponent } from './app.component';
import { CarousingComponent } from './carousing/carousing.component';
import { CombatComponent } from './combat/combat.component';
import { ForceComponent } from './force/force.component';
import { HomeComponent } from './home/home.component';
import { MapComponent } from './map/map.component';
import { MagicalItemComponent } from './magical-items/magical-item.component';
import { MonsterComponent } from './monster/monster.component';
import { MonsterManualComponent } from './monster-manual/monster-manual.component';

import { CapitalizePipe } from './pipes/capitalize.pipe';
import { MarkdownPipe } from './pipes/markdown.pipe';
import { NonePipe } from './pipes/none.pipe';

import { ForceService } from './force/force.service';
import { MapService } from './map/map.service';
import { MagicalItemService } from './magical-items/magical-item.service';
import { MonsterManualService } from './monster-manual/monster-manual.service';

@NgModule({
  declarations: [
    AppComponent,
    CarousingComponent,
    CombatComponent,
    ForceComponent,
    HomeComponent,
    MapComponent,
    MagicalItemComponent,
    MonsterComponent,
    MonsterManualComponent,
    CapitalizePipe,
    MarkdownPipe,
    NonePipe
  ],
  imports: [
    AccordionModule,
    ButtonModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    DataTableModule,
    DialogModule,
    DropdownModule,
    FormsModule,
    HttpModule,
    InputTextModule,
    MultiSelectModule,
    PanelModule,
    SharedModule,
    TabMenuModule,
    RouterModule.forRoot([{
      path: 'carousing',
      component: CarousingComponent
    }, {
      path: 'combat',
      component: CombatComponent
    }, {
      path: 'home',
      component: HomeComponent
    }, {
      path: 'force',
      component: ForceComponent
    },  {
      path: 'magical-items',
      component: MagicalItemComponent
    }, {
      path: 'map',
      component: MapComponent
    }, {
      path: 'monster-manual',
      component: MonsterManualComponent
    }, {
      path: '',
      redirectTo: '/home',
      pathMatch: 'full'
    }])
  ],
  providers: [
    ForceService,
    MapService,
    MagicalItemService,
    MonsterManualService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
