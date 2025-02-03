import { Component } from '@angular/core';
import { owner } from '../../../global.config';

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  templateUrl: './one-column.layout.html',
})
export class OneColumnLayoutComponent {
  owner = owner;
}
