import { NgModule, Directive, ElementRef } from '@angular/core';

@Directive({
    selector: 'igx-prefix,[igxPrefix]'
})
export class IgxPrefixDirective {
    constructor(public el: ElementRef) { }
 }

@NgModule({
    declarations: [IgxPrefixDirective],
    exports: [IgxPrefixDirective]
})
export class IgxPrefixModule { }
