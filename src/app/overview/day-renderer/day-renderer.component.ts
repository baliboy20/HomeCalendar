import {
    Component, ElementRef, HostBinding, Input, OnInit, QueryList, Renderer2, ViewChild, ViewChildren,
    ViewEncapsulation
} from '@angular/core';
import * as moment from 'moment';
import {Moment} from 'moment';
import {IAppointment} from '../../../services/appointment.service';


@Component({
    selector: 'app-day-renderer',
    templateUrl: './day-renderer.component.html',
    styleUrls: ['./day-renderer.component.scss'],
    encapsulation: ViewEncapsulation.Native,
})
export class DayRendererComponent implements OnInit {

    value: string;
    date: Moment;
    backCol: string;
    colors = [
        'lightgoldenrodyellow',
        'lightgreen',
        'lightpink',
        'silver'
    ];
    private _appointments: IAppointment[] = [];

    mouseLeaveDayListItem(e: Event) {
        e.preventDefault();
        e.stopImmediatePropagation();
        const el: HTMLHtmlElement = e.target as HTMLHtmlElement;
        el.style.border = '1px solid ' + this.backCol;
    }

    mouseEnterDayListItem(e: Event) {
        e.preventDefault();
        e.stopImmediatePropagation();
        const el: HTMLHtmlElement = e.target as HTMLHtmlElement;
        if (el instanceof HTMLDivElement) {
            el.style.border = '1px solid red';
        } else {
            return;
        }
    }

    mousedownDayListItem(event, a) {

    }

    @Input() set appointments(arg: IAppointment[]) {

        this._appointments = arg || [];
        // console.log('Appts in Day renderer', arg, this._appointments);
    //
    }

// string with the format 'DD/MM/YY'
    @Input('item') set item(arg: any) {
       // console.log('setting appointment inside the Renderer', arg);
        this.calcColor(moment(arg.id).format('M'), moment(arg.id).format('d'), arg);
        this.value = moment(arg).format('D');
        this.date = arg;
    }

    ngOnInit() {}

    calcColor(arg, dayno, dt: Moment) {
        let col = 1;
        if (arg % 3 === 0) {
            col = 1;
        } else if (arg % 2 === 0) {
            col = 2;
        }
        const we = [0, 6];
        if (we.includes(+dayno)) {
            col = 3;
        }
        const today = moment().format('DD/MMM/YYYY');
        if (dt === undefined) {
            console.log('dt is undefined');
            return;
        }
        if (moment(dt).isSame(today)) {
            col = 0;
        }
        this.backCol = this.colors[col];
    }
}
