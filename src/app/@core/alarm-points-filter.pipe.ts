import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'alarmPointsFilter'
})
export class AlarmPointsFilterPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
