import * as moment from 'moment';
import {Moment} from 'moment';

export class DateUtils {
    static dateKeyFormat(arg: string | Moment): string {
        if (moment(arg).isValid) {
            return moment(arg).format('D/MMM/YYYY');
        } else {
            throw new Error(`App: in DateUtils.dateKeyformat, invalid date: < ${arg} >`);
        }
        return null;
    }

    static appendDateWithTimeAsString(dt: string, tm: string) {

       let  hour = +tm.substr(0, 2);
       const min = +tm.substr(3, 2);
       if ( tm.substr(6, 2) === 'pm') {
           hour += 12;
       }
        if (moment(dt).isValid) {
          const  dt1 = moment(dt).clone();
         const   ret = moment(dt1).set({'hour': hour, 'minute': min});
         // console.log('ret', ret, hour, min, tm.substr(6, 2), tm);
         return ret.toDate().toISOString();
        } else {
            throw new Error(`DateUtils.appendDateWithTimeAsString, invalid date: ${tm} or ${dt}`);
        }
        return null;
    }

}
