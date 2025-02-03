import { Pipe, PipeTransform } from '@angular/core';
import { Point } from '../data/data';

@Pipe({ 
    name: 'alarmPointsFilter'
    //,pure: false
})
export class AlarmPointsFilterPipe implements PipeTransform {
  transform(points: Point[]) {
    return points.filter(pt => pt.type != 'alarm');
  }
}