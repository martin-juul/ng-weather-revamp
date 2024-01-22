import { Component, inject, signal, Signal } from '@angular/core';
import { WeatherService } from '../weather.service';
import { LocationService } from '../location.service';
import { Router } from '@angular/router';
import { ConditionsAndZip } from '../conditions-and-zip.type';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css'],
})
export class CurrentConditionsComponent {

  protected weatherService = inject(WeatherService);
  private router = inject(Router);
  protected locationService = inject(LocationService);
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();

  private tab = signal<ConditionsAndZip>({ zip: '', data: undefined } as ConditionsAndZip);
  protected currentTab = this.tab.asReadonly();

  constructor() {
    toObservable(this.currentConditionsByZip).pipe(takeUntilDestroyed()).subscribe((conditions) => {
      if (conditions.length > 0) {
        this.tab.set(conditions[0]);
      }
    });
  }

  selectTab(location: ConditionsAndZip) {
    this.tab.set(location);
  }

  showForecast(zipcode: string) {
    this.router.navigate(['/forecast', zipcode]);
  }

  deleteLocation(zipcode: string) {
    this.locationService.removeLocation(zipcode);
  }
}
