import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {CalendarService} from '../../services/calendar.service';
import * as moment from 'moment';
import {CdkVirtualForOf} from '@angular/cdk/scrolling';
import {ReplaySubject} from 'rxjs';
import {map} from 'rxjs/internal/operators';
import {AppointmentService, IAppointment} from '../../services/appointment.service';
import {CalcurService} from '../services/calcur.service';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent implements OnInit {
    @ViewChild(CdkVirtualScrollViewport)
    viewport: CdkVirtualScrollViewport;

    showCal = true;
    @ViewChild(CdkVirtualForOf)
    forof: CdkVirtualForOf<any>;
    items = [];
    currentIdx: any = null;
    currentDate;
    data: ReplaySubject<any> = new ReplaySubject<any>();
    recordLock = false;
    appointments: { string: Array<IAppointment> };

    constructor(public service: CalendarService,
                private calcur: CalcurService,
                public appointmentsService: AppointmentService) {

    }

    ngOnInit() {
        this.appointmentsService.getAppointments()
            .subscribe(a => {
                this.appointments = a;
                this.initCalendar();
            });
        this.data.subscribe(a => {
            // console.log('c', Array.from(a));
        })
        this.calcur.setup()
            .pipe(map(s => Array.from(s)))
            .pipe(map(this.reformat))
            .subscribe(a => {
            this.data.next( (a) );
        });
    }

    reformat(value: any) {
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

    initCalendar() {
        // this.service.initCalendar(moment('23/March/2019'), 1)
        //     .subscribe(a => {
        //         // console.log('inint calendar', a);
        //         this.data.next(a);
        //     });
    }

    scrollTo() {
        this.viewport.scrollToIndex(4);
    }

    onContentRendered() {
        console.log('on contenet rendered');
    }

    generateCalendar() {
        (this.service._increaseUpperBoundDate(1))
            .subscribe(this.data.next);
        // this.data.next(this.items);
        this.recordLock = false;
    }

    trackbyFn(idx, item) {
        return idx + item[0];
    }

    scrollIdx(ev) {
        if (true) {
            return;
        }
        // console.log('scrollid ev value', this.items[ev]);
        this.data.subscribe(a => {
            if (a.length === 0) {
                console.log('data', a, ev);
            } else {
                // console.log('data', a[ev]);
                this.currentIdx = moment(a[ev][0]).format('MMMM YY');
            }
        });
        // this.currentIdx = moment(this.items[ev][0]).format('MMMM YY');
        ScrollDirection.updateScrollPosition(ev);

        if (ev + 7 > this.viewport.getDataLength() && !this.recordLock) {
            this.recordLock = true;
            this.generateCalendar();
        }

        if (ev === 0 && ScrollDirection.direction === ScrollDirection.IS_UP) {
            // const a = (this.service._decreaseLowerBoundDate(1));
            // NOTE TO UNDO THIS FOR EXTENDING LOWER BOUND this.data.next(a);
            //
            //  setTimeout(() => {
            //      this.viewport.scrollToIndex(10);
            //      // this.viewport.scrollToOffset(10);
            //      // console.log('FIRED.....');
            //  }, 500);

            this.recordLock = false;
        }
    }
}

class ScrollDirection {
    static IS_UP = -1;
    static IS_DOWN = 1;
    static currIdx = 0;
    static prevIdx = 0;
    static direction: -1 | 1 = 1;

    static updateScrollPosition(idx: number) {
        this.prevIdx = this.currIdx;
        this.currIdx = idx;
        this.direction = this.currIdx > this.prevIdx ? 1 : -1;
    }
}
