import { Component, ViewChild, OnInit } from '@angular/core';
import { IgxTimePickerComponent } from 'igniteui-angular';
import { InteractionMode } from 'projects/igniteui-angular/src/public_api';

@Component({
    selector: 'app-time-picker-sample',
    styleUrls: [ 'time-picker.sample.css' ],
    templateUrl: 'time-picker.sample.html'
})
export class TimePickerSampleComponent {
    max = "18:00";
    min = "9:00";
    itemsDelta = { hours: 1, minutes: 15 };
    format="H:m";
    isSpinLoop = true;
    mode = InteractionMode.dropdownInput;

    date = null; // new Date(Date.now());

    @ViewChild("picker")
    public picker: IgxTimePickerComponent;
}
