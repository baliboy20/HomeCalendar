import {TestBed} from '@angular/core/testing';
// import {CalendarService, CalendarServiceTest} from './calendar.services';
import * as moment from 'moment';
import {CalendarService} from './calendar.service';


describe('CalendarService', () => {
    beforeEach(() => {

        TestBed.configureTestingModule({});
        console.log('before each');
    });

    it('Should correctly calculat date ranges by week', () => {
        const service: CalendarService = TestBed.get(CalendarService);

        const dt = moment('15/03/2019', 'DD/MM/YYYY');

        const s = service._calcLowerMostDate(dt, -3);
        expect(service._calcLowerMostDate(dt, -3).format('ddd DD/MM/YY')).toBe('Mon 26/11/18');
        expect(service._calcUpperMostDate(dt, 3).format('ddd DD/MM/YY')).toBe('Mon 24/06/19');

        // const dates = service.initCalendar(dt);
        // console.log('dataes num', dates.length, service.calItems);
        //
        // const newLowerDate = service._decreaseLowerBoundDate(-1);
        // console.log('lowerdataes regressed', dates[dates.length - 1]);

        // const newUpperDate = service._decreaseUpperBoundDate(1);
        // console.log('upper dates regressed 1month', newUpperDate[newUpperDate.length - 1]);
        //
        // const newUpperDate1 = service._increaseUpperBoundDate(1);
        // console.log('upper dates progressed 1month', newUpperDate1[newUpperDate1.length - 1]);
        //
        // const newUpperDate2 = service._decreaseUpperBoundDate(1);
        // console.log('decrease upper date 1month', newUpperDate2[newUpperDate2.length - 1]);
    });


});

// });
