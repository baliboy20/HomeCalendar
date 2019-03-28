import {Injectable} from '@angular/core';
import * as moment from 'moment';
import {Moment} from 'moment';
import {Error} from 'tslint/lib/error';
import {Observable, of, ReplaySubject} from 'rxjs';
import {DateUtils} from '../app/utils/date-utils';
import {isUndefined} from 'util';

@Injectable({
    providedIn: 'root'
})
export class CalendarService {
    set calItems(value: Array<any>) {
        this._calItems = value;
    }

    get calItems(): Array<any> {
        return this._calItems;
    }

    private _calItems: Array<any>;
    private _calItems$: ReplaySubject<any> = new ReplaySubject<any>();

    get calItems$(): ReplaySubject<any> {
        return this._calItems$;
    }

    set calItems$(value: ReplaySubject<any>) {
        this._calItems$ = value;
    }

    get lowerWeek(): any {
        return this._lowerWeek;
    }

    get upperWeek(): any {
        return this._upperWeek;
    }

    set lowerWeek(value: any) {
        console.log('set', value);
        this._lowerWeek = value;
    }

    set upperWeek(value: any) {
        console.log('setting upper weeek', value);
        this._upperWeek = value;
    }

    constructor() {
    }

    private _lowerWeek: Moment;  // Mon day of week that is the start of the month;
    private _upperWeek: Moment;   // Mon of the week that ends the month
    /**
     *
     * @param {moment.Moment} curDate
     * @return {moment.Moment}
     * @private
     */
    protected _computeStartOfWeek(curDate: Moment): Moment {
        const weekdayIdx = moment(curDate).weekday() - 1;
        const firstMonOfCalMnth = moment(curDate).subtract(weekdayIdx, 'days');
        return firstMonOfCalMnth;
    }

    /**
     *  calculates a forward date of the future date, returns the monday of the last week of the Month;
     * @param curDate
     * @param  interval  may +ve to add months, -ve to remove months
     * @returns {moment.Moment}
     * @private
     */
    _calcLowerMostDate(curDate: any, interval: number) {
        const f = this._fmDt;
        curDate = moment(curDate).clone();
        let newDate;
        if (interval > 0) {
            newDate = moment(curDate).add(interval, 'month');
        } else {

            newDate = moment(curDate).add(interval, 'month');
            // console.log('lesss than 0', interval, 'new date', f(newDate));
        }
        const firstDayofMonth = moment(newDate).startOf('month');

        const weekdayIdxF = moment(firstDayofMonth).weekday();
        // console.log('firstday of mont', f(firstDayofMonth), weekdayIdxF);
        return moment(firstDayofMonth).subtract(weekdayIdxF - 1, 'days');
    }

    _fmDt(date: Moment | string): string {
        if (isUndefined(date)) {
            console.log('fmDt, value is undefined');
        }
        return DateUtils.dateKeyFormat(date);
        // return date.format('D/MMM/YYYY');
    }

    /**
     *  calculates a upppermost date of the future date, returns the monday of the last week of the Month;
     * @param curDate
     * @param {number} interval
     * @returns {moment.Moment}
     * @private
     */
    _calcUpperMostDate(curDate: any, interval: number) {
        curDate = moment(curDate).clone();
        let newDate;
        if (interval > 0) {
            newDate = moment(curDate).add(interval, 'month');
        } else {
            newDate = moment(curDate).add(interval, 'month');
        }
        const lastDayOfMnth = moment(newDate).endOf('month');
        const weekdayIdxF = moment(lastDayOfMnth).weekday();
        const lastMon = moment(lastDayOfMnth).subtract(weekdayIdxF === 0 ? 6 : (weekdayIdxF - 1), 'days');
        // console.log('LAST MON OF THE MONTH', this._fmDt(lastMon));
        return lastMon;
    }


    initCalendar(curDate: any, numMonths: number): Observable<Array<any>> {
        this.calItems$.next(this._generateCalendar(curDate, numMonths));
        this.calItems$.subscribe(a => this.calItems = a);
        return this.calItems$;
    }

    _populateStruc(lowerdate: Moment): any {
        const items = [];
        let newDate = lowerdate.clone();
        let dayincr = 1;
        while (dayincr <= 7) {
            const strcDate = {
                date: this._fmDt(newDate),
                day: moment().format('DD'),
                month: moment().format('MM'),
                month_long: moment().format('MMMM'),
                Year: moment().format('YYYY')
            };
            items.push(this._fmDt(newDate));
            dayincr++;
            newDate = newDate.add(1, 'days');
        }
        return items;
    }

    _generateCalendar(curDate: any = moment(), numMnths: number): Array<any> {
        numMnths = (numMnths < 0) ? numMnths * -1 : numMnths;
        let upperDate = this.upperWeek = this._calcUpperMostDate(curDate, numMnths);
        let lowerDate = this.lowerWeek = this._calcLowerMostDate(curDate, -numMnths);
        upperDate = upperDate.clone().add(6, 'days'); // taking it to sun.
        let iterGuard = 0;
        const weeks = [];
        while (lowerDate.isSameOrBefore(upperDate)) {
            // console.log('rage', this._fmDt(lowerDate), this._fmDt(upperDate));
            const strc = this._populateStruc(lowerDate.clone());
            weeks.push(strc);
            lowerDate = moment(lowerDate).add(7, 'days');
            iterGuard++;
            if (iterGuard > 3000) {
                break;
            }
        }
        return weeks;
    }

    /**
     * Decrease the lower bound date (increase the range).
     * @param numMnths -ve nums regress, +ve value progresses
     * @private
     * @return array of active rates.
     */
    _decreaseLowerBoundDate(numMnths) {
        // get the existing lower monday
        const a = this.lowerWeek;
        // const work out starting week of month before;
        numMnths = (numMnths > 0) ? numMnths * -1 : numMnths;
        const newlowerDate: Moment = this._calcLowerMostDate(this.lowerWeek, numMnths).clone();
        const currLowerDate: Moment = this.lowerWeek;
        let iterGuard = 0;
        const weeks = [];
        let iter: Moment = newlowerDate.clone();
        while (iter.isBefore(currLowerDate)) {
            // console.log('DTEA CALCS', this._fmDt(iter));
            // console.log('rage', this._fmDt(newlowerDate), this._fmDt(currLowerDate));
            const strc = this._populateStruc(iter.clone());
            // console.log('strc', strc);
            weeks.push(strc);
            iter = moment(iter).add(7, 'days');
            iterGuard++;
            if (iterGuard > 3000) {
                break;
            }
        }
        this.lowerWeek = newlowerDate;
        // this.calItems.unshift(...weeks);
        this._calItems = Array().concat(weeks, this.calItems);
        // console.log('NEW ITESMADDED BEFORE', this._fmDt(currLowerDate), this._fmDt(newlowerDate));
        return this.calItems$.next(this.calItems);
    }

    /**
     * Increase the upperbound date.
     * @param numMnths -ve nums regress, +ve value progresses
     * @private
     * @return array of active rates.
     */
    _increaseUpperBoundDate(numMnths) {
        console.log('CALLLING...', this._fmDt(this.upperWeek), this.upperWeek);
        // get the existing lower monday
        // const a = this.lowerWeek;
        // const work out starting week of month before;
        numMnths = (numMnths < 0) ? numMnths * -1 : numMnths;
        const newUpperDate: Moment = this._calcUpperMostDate(this.upperWeek, numMnths);
        let currUpperDate: Moment = this.upperWeek.add(7, 'days');
        let iterGuard = 0;
        const weeks = [];

        console.log('NEW upperdayes', this._fmDt(this.upperWeek), this._fmDt(currUpperDate), this._fmDt(newUpperDate));
        while (currUpperDate.isSameOrBefore(newUpperDate)) {
            const strc = this._populateStruc(currUpperDate.clone());
            weeks.push(strc);
            currUpperDate = moment(currUpperDate).add(7, 'days').clone();
            iterGuard++;
            if (iterGuard > 30) {
                break;
            }
        }
        this.upperWeek = newUpperDate;
        // this.calItems.push(...weeks);
        console.log('new weeks in Calitme', newUpperDate, this.upperWeek, weeks);
        this._calItems = Array().concat(this.calItems, weeks);
        this.calItems$.next(this.calItems);
        return this.calItems$;
    }

    /**
     * Reduce date back from the future.
     * @param numMnths -ve nums regress, +ve value progresses
     * @private
     * @return array of active rates.
     */
    _decreaseUpperBoundDate(numMnths): Observable<any> {
        // get the existing lower monday
        const a = this.upperWeek;
        // const work out starting week of month before;
        numMnths = (numMnths > 0) ? numMnths * -1 : numMnths;

        const newUpperDate: Moment = this._calcUpperMostDate(this.upperWeek, numMnths);
        let iterGuard = 0;
        const weeks = [];

        let stillAfter = true;
        while (stillAfter) {
            const len = this.calItems.length - 1;
            if (this.calItems[len][0] === this._fmDt(newUpperDate)) {
                stillAfter = false;
            } else {
                this.calItems.pop();
            }

            iterGuard++;
            if (iterGuard > 3000) {
                throw new Error('Iter guard called');
                break;
            }
        }
        this.upperWeek = newUpperDate;
        this.calItems$.next(this.calItems);
        return this.calItems$;
    }

    /**
     * Increase lower bound date date.
     * @param numMnths -ve nums regress, +ve value progresses
     * @private
     * @return array of active rates.
     */
    _increaseLowerBoundDate(numMnths): Observable<Array<any>> {
        // get the existing lower monday
        const a = this.lowerWeek;
        // const work out starting week of month before;
        numMnths = (numMnths < 0) ? numMnths * -1 : numMnths;

        const newLowerDate: Moment = this._calcLowerMostDate(this.lowerWeek, numMnths);
        let iterGuard = 0;
        const weeks = [];

        let stillBefore = true;
        while (stillBefore) {
            const len = this.calItems.length - 1;
            if (this.calItems[len][0] === this._fmDt(newLowerDate)) {
                stillBefore = false;
            } else {
                this.calItems.unshift(0, 1);
            }

            iterGuard++;
            if (iterGuard > 3000) {
                throw new Error('Iter guard called');
                break;
            }
        }
        this.lowerWeek = newLowerDate;
        this.calItems$.next(this.calItems);
        return this.calItems$;
    }

}

