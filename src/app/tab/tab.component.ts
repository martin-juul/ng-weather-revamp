import { Component } from '@angular/core';

@Component({
  selector: 'app-tab',
  standalone: true,
  template: `
    <div class="tab">
      <ng-content></ng-content>
    </div>
  `,
  styles: `
    .tab {
      display: flex;
      justify-content: space-between;
      height: 25px;
      background-color: #617aa0;
      color: #fff;
      max-width: 200px;
      padding-top: 2px;
      cursor: pointer;
    }
  `,
})
export class TabComponent {}
