import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OverviewComponent} from './overview.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CalendarService} from '../../services/calendar.service';
import {DayRendererComponent} from './day-renderer/day-renderer.component';
import {AppointmentService} from '../../services/appointment.service';
import {
    MAT_DIALOG_DEFAULT_OPTIONS, MatDatepicker, MatDatepickerModule, MatDialogModule, MatDialogRef,
    MatFormFieldModule, MatInputModule, MatNativeDateModule
} from '@angular/material';
import {ApptQuickViewComponent } from './appt-quick-view/appt-quick-view.component';
import {MousedownDirective} from './appt-quick-view/mousedown.directive';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpService} from '../../services/http.service';
import { MonsPipe } from './mons.pipe';

@NgModule({
    imports: [
        CommonModule,
        ScrollingModule,
        MatDialogModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [
        OverviewComponent,
        DayRendererComponent,
        MousedownDirective,
        ApptQuickViewComponent,
        MonsPipe],
    exports: [OverviewComponent, MonsPipe],
    entryComponents: [ ApptQuickViewComponent],
    providers: [CalendarService, AppointmentService, {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}, HttpService]
})
export class OverviewModule {
}
