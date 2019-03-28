import {TestBed} from '@angular/core/testing';

import {CalcurService, CalcurUtils} from './cal-calcur.service';
import {CalendarService} from '../../services/calendar.service';
import * as moment from 'moment';
import {Moment} from 'moment';


describe('CalCalcurService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));


    it('Should correctly calculat date ranges', () => {
        const service: CalcurService = TestBed.get(CalcurService);
        const dt = CalcurUtils.startOfWeek('23/MAR/2019');
        console.log('dt', dt);
        expect(CalcurUtils.startOfWeek('23/MAR/2019')).toBe('18/Mar/19');
        expect(CalcurUtils.startOfWeek('18/MAR/2019')).toBe('18/Mar/19');
        expect(CalcurUtils.startOfWeek('17/MAR/2019')).toBe('18/Mar/19');
        expect(CalcurUtils.startOfWeek('25/MAR/2019')).toBe('25/Mar/19');
        expect(CalcurUtils.startOfWeek('24/MAR/2019')).toBe('25/Mar/19');
        expect(CalcurUtils.startOfWeek('31/dec/2018')).toBe('31/Dec/18');
        expect(CalcurUtils.backMonths('24/MAR/2019', 3, 'LASTDAY')).toBe('31/Dec/18');
        expect(CalcurUtils.backMonths('24/MAR/2019', 3, 'FIRSTDAY')).toBe('26/Nov/18');
        expect(CalcurUtils.forwardMonths('24/MAR/2019', 3, 'LASTDAY')).toBe('01/Jul/19');
        expect(CalcurUtils.forwardMonths('24/MAR/2019', 3, 'FIRSTDAY')).toBe('27/May/19');
        // expect(dt).toBeUndefined();

    });

    it('generate the calendar corectly', () => {
        const service: CalcurService = TestBed.get(CalcurService);
//
        service.setup().subscribe(console.log);

    });

}
