import { Component, ViewChild, OnInit } from '@angular/core';
import { IgxTimePickerComponent } from 'igniteui-angular';
import { InteractionMode } from 'projects/igniteui-angular/src/public_api';

@Component({
    selector: 'app-time-picker-sample',
    styleUrls: [ 'time-picker.sample.css' ],
    templateUrl: 'time-picker.sample.html'
})
export class TimePickerSampleComponent {
    max = "19:00";
    min = "09:00";
    itemsDelta = { hours: 1, minutes: 15 };
    format="HH:mm";
    isSpinLoop = true;
    mode = InteractionMode.dropdownInput;

    date = null;

    @ViewChild("picker")
    public picker: IgxTimePickerComponent;
}
