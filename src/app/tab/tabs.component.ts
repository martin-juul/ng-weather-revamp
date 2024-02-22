import { AfterContentChecked, Component, ContentChildren, EventEmitter, Input, Output, QueryList } from '@angular/core';
import { DecimalPipe, NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import { TabComponent } from './tab.component';

@Component({
  selector: 'app-tabs',
  standalone: true,
  template: `
    <div class="tab-group">
      <div class="tab"
        *ngFor="let tab of tabs; index as i"
        style="margin-right: 4px;"
        (click)="selectTab(i)"
      >
        <div class="content">
          {{ tab.title }}
        </div>

        <div class="close-btn" (click)="closeTab(i)">X</div>
      </div>
    </div>

    <ng-container *ngIf="current">
      <ng-container *ngTemplateOutlet="current?.template"></ng-container>
    </ng-container>
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
    NgTemplateOutlet,
  ],
})
export class TabsComponent<T> implements AfterContentChecked {
  @Input() tabs: Tab<T>[] = [];
  @Output() closedTab = new EventEmitter<Tab<T>>();

  @ContentChildren(TabComponent) tabComponents: QueryList<TabComponent>
  current: TabComponent;

  selectTab(index: number) {
    this.current = this.tabComponents.find((_, i) => i === index);
  }

  closeTab(index: number) {
    this.tabComponents.reset(this.tabComponents.filter((_, i) => i !== index));
    const deletedTab: Tab<T> = this.tabs.splice(index, 1)[0];
    this.closedTab.emit(deletedTab);

    if (this.tabComponents.length === 0) {
      this.current = null;
    } else {
      this.current = this.tabComponents.first;
    }
  }

  ngAfterContentChecked() {
    setTimeout(() => {
      if (!this.current) {
        this.current = this.tabComponents.first;
      }
    });
  }
}

export interface Tab<T> {
  id: string;
  title: string;
  data: T;
}
