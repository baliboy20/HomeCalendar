import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import {DateUtils} from '../utils/date-utils';
import {isNull} from 'util';
@Pipe({
  name: 'mons',
})
export class MonsPipe implements PipeTransform {

  transform(value: any[], args?: any): any {
const dates_arr = [];
// let week: { [day: string]: any[]};
// let days: any[];

    while ( value.length > 0) {
      const arr = value.splice(0, 7);
      console.log('arr', arr);
      const dt = moment(arr[0]).format('DD/MMM/YY/');
      const x = {id: dt, days: arr};
      dates_arr.push(x);
    }
  //  console.log('formatted array', dates_arr);
    return dates_arr;
  }

}
