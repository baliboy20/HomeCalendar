import {Injectable} from '@angular/core';
// import {from} from 'rxjs';
import * as moment from 'moment';
// import {Moment} from 'moment';
// import _date = moment.unitOfTime._date;
import {DateUtils} from '../app/utils/date-utils';
import {HttpService} from './http.service';
import {map, mergeMap, reduce} from 'rxjs/internal/operators';
import {tap} from 'rxjs/operators';
import {flatMap} from 'tslint/lib/utils';
import {from, Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AppointmentService {

    constructor( private http: HttpService) {
        // if (!http) {
        //     throw new Error('HTTp service no injectecd');
        // } else {
        //     console.log('Is inmected');
        // }
    }

    reducer = (acc, app: IAppointment) => {
        // const dt = app.from;
        // if (dt instanceof Date || dt instanceof moment) {
        //     dt = moment(dt).toDate().toLocaleDateString();
        // }
        // console.log('reduceIng', app, acc);
        const dt1: string =  DateUtils.dateKeyFormat(app.from);
        if (acc.hasOwnProperty(dt1)) {
            acc[dt1].push(app);
        } else {
            acc[dt1] = [app];
        }
        return acc;
    }

    getAppointments() {
        // console.log('inside appts');
        return this.http.findAll()
            .pipe(
                mergeMap( (a: any) => from(a)),
                map( (a: any) => AppointmentUtils.transformToEditingFormat(a)),
                reduce(this.reducer, {}));
    }

}

export class AppointmentFactory {
    static instanceOf(): IAppointmentInput {
        return {
            to_timepart: '',
            to_datepart: '',
            to: '',
            from_timepart: '',
            from_datepart: '',
            from: '',
            title: '',
            attendees: '',
            _id: '',
            location: '',
        };
    }
}


export class AppointmentUtils {
    static transformToDbFormat(arg: IAppointmentInput): IAppointment {
        const app: IAppointment = {
            title: arg.title,
            from: DateUtils.appendDateWithTimeAsString(arg.from_datepart, arg.from_timepart),
            to: DateUtils.appendDateWithTimeAsString(arg.to_datepart, arg.to_timepart),
            attendees: arg.attendees,
            location: 'xxx',
            _id: arg._id,
        };
        return app;
    }

    static transformToEditingFormat(arg: IAppointment): IAppointmentInput {
        const app: IAppointmentInput = {
            title: arg.title,
            from: arg.from,
            to: arg.to,
            from_datepart: DateUtils.dateKeyFormat(arg.from),
            to_datepart: DateUtils.dateKeyFormat(arg.to),
            from_timepart: moment(arg.to).format('hh:mm a'),
            to_timepart: moment(arg.to).format('hh:mm a'),
            attendees: arg.attendees,
            location: 'xxx',
            _id: arg._id,
        };
        return app;
    }
}

export interface IAppointment {
    from:  string;
    to:    string;
    title: string;
    attendees: string;
    location?: string;
    _id: string;
}

export interface IAppointmentInput extends IAppointment {
    from_timepart: string;
    from_datepart: string;
    to_datepart: string;
    to_timepart: string;
}