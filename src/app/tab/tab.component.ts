import { Component, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-tab',
  standalone: true,
  template: '<ng-template><ng-content></ng-content></ng-template>',
})
export class TabComponent {
  @ViewChild(TemplateRef) template: TemplateRef<never>;
}
