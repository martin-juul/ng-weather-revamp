import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DecimalPipe, NgForOf, NgIf } from '@angular/common';
import { ConditionsAndZip } from '../conditions-and-zip.type';

@Component({
  selector: 'app-tab',
  standalone: true,
  template: `
    <div class="tab-group">
      <div class="tab"
        *ngFor="let tab of tabs"
        style="margin-right: 4px;"
        (click)="selectTab(tab)"
      >
        <div class="content">
          {{ tab.title }}
        </div>

        <div class="close-btn" (click)="closeTab()">X</div>
      </div>
    </div>

    <ng-content></ng-content>
  `,
  styles: `
      .tab-group {
         display: flex;
      }
      .tab {
          display: flex;
          justify-content: space-between;
          height: 25px;
          background-color: #617aa0;
          color: #fff;
          max-width: 200px;
          padding-top: 2px;
          cursor: pointer;
          padding-left: 13px;
          padding-right: 13px;
      }
      .close-btn {
          padding-left: 6px;
      }
  `,
  imports: [
    DecimalPipe,
    NgForOf,
    NgIf,
  ],
})
export class TabComponent {
  @Input() tabs: Tab[] = [];
  @Output() selectedTab = new EventEmitter<Tab>();
  @Output() closedTab = new EventEmitter<Tab>();

  closeTab() {
    this.closedTab.emit();
  }

  selectTab(tab: Tab) {
    this.selectedTab.emit(tab);
  }
}

export interface Tab {
  id: string;
  title: string;
}
