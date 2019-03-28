import {Injectable} from '@angular/core';
import * as moment from 'moment';
import {Moment} from 'moment';
import {range, ReplaySubject} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {reduce} from 'rxjs/operators';
import {isNull} from 'util';

export interface IDateRange {
    start: string;
    finish: string;
}

@Injectable({
    providedIn: 'root'
})
export class CalcurService {

    interval: [string, string] = ['ss', 'uuu'];

    constructor() {
    }

    setup(seedDate = (moment()), rangepart: number = 2): ReplaySubject<Set<string>> {
        const st = CalcurUtils.backMonths(moment().format(CalcurUtils.DateKeyFormat), rangepart, 'FIRSTDAY');
        const fn = CalcurUtils.forwardMonths(moment().format(CalcurUtils.DateKeyFormat), rangepart, 'LASTDAY');
        const cr = new CalendarRange(st, fn);
        return cr.calendar$;
    }
}

export class CalendarRange implements IDateRange {
    constructor(st: string, fn: string) {
        this.start = st;
        this.finish = fn;
    }

    //
    get calendar$(): ReplaySubject<Set<string>> {
        return this._calendar$;
    }

    set calendar$(value: ReplaySubject<Set<string>>) {
        this._calendar$ = value;
    }

    get start(): string {
        return this._start;
    }

    set start(value: string) {
        if (value === this._start) {
            return;
        }
        this._start = value;
        if (isNull(this.finish) === false) {
            this.generate();
        }
    }

    get finish(): string {
        return this._finish;
    }

    set finish(value: string) {
        if (value === this._finish) {
            return;
        }
        this._finish = value;
        if (isNull(this.start) === false) {
            this.generate();
        }
    }

    private _start: string;
    private _finish: string;
    private _calendar$: ReplaySubject<Set<string>> = new ReplaySubject<Set<string>>();

    // private _last_calendar: Set<string>;

    generate() {
        const days = moment(this.finish).diff(this.start, 'days') + 7;
        return range(0, days)
            .pipe(
                // tap(console.log),
                map(a => {
                    return moment(this.start).add(a, 'days').clone();
                }),
                map(  ( b: Moment) => b.format(CalcurUtils.DateKeyFormat)),
                reduce( this._addSetReducer, new Set())
            ).subscribe(arg => this.calendar$.next(arg));
    }

    _addSetReducer = (set: Set<string>, value) => {
        set.add(value);
        return set;
    };

}

export class CalcurUtils {
    static DateKeyFormat = 'DD/MMM/YY';

    static isValidRange(range1): boolean {
        return moment(range1.finish).diff(range1.start, 'days') > 0;
    }

    static backMonths(from: string, duration: number, pos: 'LASTDAY' | 'FIRSTDAY'): string {
        const d1: Moment = moment(from).subtract(duration, 'months');
        return ((pos === 'FIRSTDAY') ? d1.startOf('month').startOf('week') : d1.endOf('month').startOf('week') as Moment)
            .weekday(1)
            .format(this.DateKeyFormat);
    }

    static forwardMonths(from: string, duration: number, pos: 'LASTDAY' | 'FIRSTDAY'): string {
        const d1: Moment = moment(from).add(duration, 'months');
        // console.log('starting..', d1.clone().startOf('week').add(7, 'days'));
        return ((pos === 'FIRSTDAY') ? d1.startOf('month') : d1.endOf('month') as Moment)
            .startOf('week')
            .weekday(1)
            .format(this.DateKeyFormat);
    }

    static startOfWeek(from: string): string {
        return moment(from).startOf('week').weekday(1)
            .format(this.DateKeyFormat);
    }

    static endOfWeek(from: string) {
        return moment(from).startOf('week').isoWeekday(7)
            .format(this.DateKeyFormat);
    }
}