import { Component } from '@angular/core';
import { version } from '../../../global.config';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
      Created with <span style="color:red;">♥</span> by <b>Accent</b> 2023
    </span>
    <span>Version: {{version}}</span>
  `,
})
export class FooterComponent {
  version = version;
}
