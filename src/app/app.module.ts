import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ZipcodeEntryComponent } from './zipcode-entry/zipcode-entry.component';
import {LocationService} from "./location.service";
import { ForecastsListComponent } from './forecasts-list/forecasts-list.component';
import {WeatherService} from "./weather.service";
import { CurrentConditionsComponent } from './current-conditions/current-conditions.component';
import { MainPageComponent } from './main-page/main-page.component';
import {RouterModule} from "@angular/router";
import {routing} from "./app.routing";
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { TabsComponent } from './tab/tabs.component';
import { CachingInterceptor } from './caching.interceptor';
import { TabComponent } from './tab/tab.component';

@NgModule({
  declarations: [
    AppComponent,
    ZipcodeEntryComponent,
    ForecastsListComponent,
    CurrentConditionsComponent,
    MainPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    routing,
    TabsComponent,
    TabComponent,
  ],
  providers: [
    LocationService,
    WeatherService,
    { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
