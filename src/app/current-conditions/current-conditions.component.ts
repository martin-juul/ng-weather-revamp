import { Component, inject, signal, Signal } from '@angular/core';
import { WeatherService } from '../weather.service';
import { LocationService } from '../location.service';
import { Router } from '@angular/router';
import { ConditionsAndZip } from '../conditions-and-zip.type';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Tab } from '../tab/tab.component';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css'],
})
export class CurrentConditionsComponent {
  tabs: Tab[] = [];

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

        this.tabs = conditions.map((condition) => ({ id: condition.zip, title: `${condition.data.name} (${condition.zip})` }));
      }
    });
  }

  onSelectedTab(tab: Tab) {
    this.tab.set(this.currentConditionsByZip().find((condition) => condition.zip === tab.id));
  }

  onDeletedTab(tab: Tab) {
    this.locationService.removeLocation(tab.id);
  }

  showForecast(zipcode: string) {
    this.router.navigate(['/forecast', zipcode]);
  }

  deleteLocation(zipcode: string) {
    this.locationService.removeLocation(zipcode);
  }
}
