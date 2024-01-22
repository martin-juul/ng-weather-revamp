import { Injectable, OnDestroy, Signal, signal } from '@angular/core';
import { Observable, Subject, take, zipWith } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { CurrentConditions } from './current-conditions/current-conditions.type';
import { ConditionsAndZip } from './conditions-and-zip.type';
import { Forecast } from './forecasts-list/forecast.type';
import { LocationService } from './location.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const APPID = '5a4b2d457ecbef9eb2a71e480b947604';
const URL = 'https://api.openweathermap.org/data/2.5';
const ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';

@Injectable()
export class WeatherService {
  private currentConditions = signal<ConditionsAndZip[]>([]);

  constructor(
    private locationService: LocationService,
    private http: HttpClient) {

    this.locationService.locations$.pipe(
      take(1),
    ).subscribe((zipCodes) => {
      for (const zipCode of zipCodes) {
        this.addCurrentConditions(zipCode);
      }
    });

    this.locationService.added$.pipe(takeUntilDestroyed())
      .subscribe(zipcode => this.addCurrentConditions(zipcode));

    this.locationService.removed$.pipe(takeUntilDestroyed())
      .subscribe(zipcode => this.removeCurrentConditions(zipcode));
  }

  addCurrentConditions(zipcode: string): void {
    // Here we make a request to get the current conditions data from the API. Note the use of backticks and an expression to insert the zipcode
    this.http.get<CurrentConditions>(`${URL}/weather?zip=${zipcode},us&units=imperial&APPID=${APPID}`)
      .subscribe(data => {
        this.currentConditions.update(conditions => [...conditions, { zip: zipcode, data }]);
      });
  }

  removeCurrentConditions(zipcode: string) {
    this.currentConditions.update(conditions => {
      for (let i in conditions) {
        if (conditions[i].zip == zipcode) {
          conditions.splice(+i, 1);
        }
      }
      return conditions;
    });
  }

  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this.currentConditions.asReadonly();
  }

  getForecast(zipcode: string): Observable<Forecast> {
    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    return this.http.get<Forecast>(`${URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${APPID}`);

  }

  getWeatherIcon(id: number): string {
    if (id >= 200 && id <= 232) {
      return ICON_URL + 'art_storm.png';
    } else if (id >= 501 && id <= 511) {
      return ICON_URL + 'art_rain.png';
    } else if (id === 500 || (id >= 520 && id <= 531)) {
      return ICON_URL + 'art_light_rain.png';
    } else if (id >= 600 && id <= 622) {
      return ICON_URL + 'art_snow.png';
    } else if (id >= 801 && id <= 804) {
      return ICON_URL + 'art_clouds.png';
    } else if (id === 741 || id === 761) {
      return ICON_URL + 'art_fog.png';
    } else {
      return ICON_URL + 'art_clear.png';
    }
  }
}
