import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { ButtonModule, DataTableModule, DropdownModule, MultiSelectModule, PanelModule, SharedModule, TabMenuModule } from 'primeng/primeng';

import { AppComponent } from './app.component';
import { CarousingComponent } from './carousing/carousing.component';
import { CombatComponent } from './combat/combat.component';
import { ForceComponent } from './force/force.component';
import { HomeComponent } from './home/home.component';
import { MapComponent } from './map/map.component';

import { ForceService } from './force/force.service';
import { MapService } from './map/map.service';

@NgModule({
  declarations: [
    AppComponent,
    CarousingComponent,
    CombatComponent,
    ForceComponent,
    HomeComponent,
    MapComponent
  ],
  imports: [
    ButtonModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    DataTableModule,
    DropdownModule,
    FormsModule,
    HttpModule,
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
    }, {
      path: 'map',
      component: MapComponent
    }, {
      path: '',
      redirectTo: '/home',
      pathMatch: 'full'
    }])
  ],
  providers: [
    ForceService,
    MapService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
