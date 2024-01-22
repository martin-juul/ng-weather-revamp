import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export const LOCATIONS: string = 'locations';

@Injectable()
export class LocationService {
  get locations$() {
    return this.items.asObservable();
  }
  private items = new BehaviorSubject<string[]>([]);

  get added$() {
    return this.added.asObservable();
  }
  private added = new Subject<string>();

  get removed$() {
    return this.removed.asObservable();
  }
  private removed = new Subject<string>();

  constructor() {
    const locString = localStorage.getItem(LOCATIONS);
    if (locString) {
      this.items.next(JSON.parse(locString));
    }
  }

  addLocation(zipcode: string) {
    const items = this.items.value.slice();
    this.items.next([...items, zipcode]);
    localStorage.setItem(LOCATIONS, JSON.stringify(this.items.value));

    this.added.next(zipcode);
  }

  removeLocation(zipcode: string) {
    const items = this.items.value.slice();

    let index = items.indexOf(zipcode);
    if (index !== -1) {
      const removed = items.splice(index, 1);
      this.removed.next(removed[0]);
      this.items.next(items)

      localStorage.setItem(LOCATIONS, JSON.stringify(items));
    }
  }
}
