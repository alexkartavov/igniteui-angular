import { CommonModule } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    ContentChildren,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    NgModule,
    OnInit,
    Output,
    QueryList,
    ViewChild
} from '@angular/core';
import { IToggleView } from '../core/navigation';
import { IgxSelectionAPIService } from '../core/selection';
import { IgxOverlayDirective, IgxToggleModule } from '../directives/toggle/toggle.directive';
import { IgxDropDownItemComponent } from './drop-down-item.component';
import { IPositionStrategy } from '../services/overlay/position/IPositionStrategy';

export interface ISelectionEventArgs {
    oldSelection: IgxDropDownItemComponent;
    newSelection: IgxDropDownItemComponent;
}

enum Direction {
    Up = -1,
    Down = 1
}

/**
 * **Ignite UI for Angular DropDown** -
 * [Documentation](https://www.infragistics.com/products/ignite-ui-angular/angular/components/drop-down.html)
 *
 * The Ignite UI for Angular Drop Down displays a scrollable list of items which may be visually grouped and
 * supports selection of a single item. Clicking or tapping an item selects it and closes the Drop Down
 *
 * Example:
 * ```html
 * <igx-drop-down>
 *   <igx-drop-down-item *ngFor="let item of items" isDisabled={{item.disabled}} isHeader={{item.header}}>
 *     {{ item.value }}
 *   </igx-drop-down-item>
 * </igx-drop-down>
 * ```
 */
@Component({
    selector: 'igx-drop-down',
    templateUrl: './drop-down.component.html'
})
export class IgxDropDownComponent implements OnInit {
    private _initiallySelectedItem: IgxDropDownItemComponent = null;
    private _focusedItem: IgxDropDownItemComponent = null;
    private _width;
    private _height;
    private _id = 'DropDown_0';

    @ContentChildren(forwardRef(() => IgxDropDownItemComponent))
    private children: QueryList<IgxDropDownItemComponent>;

    @ViewChild(IgxOverlayDirective)
    private toggleDirective: IgxOverlayDirective;

    /**
     * Emitted when item selection is changing, before the selection completes
     */
    @Output()
    public onSelection = new EventEmitter<ISelectionEventArgs>();

    /**
     * Emitted before the dropdown is opened
     */
    @Output()
    public onOpening = new EventEmitter();

    /**
     * Emitted after the dropdown is opened
     */
    @Output()
    public onOpened = new EventEmitter();

    /**
     * Emitted before the dropdown is closed
     */
    @Output()
    public onClosing = new EventEmitter();

    /**
     * Emitted after the dropdown is closed
     */
    @Output()
    public onClosed = new EventEmitter();

    /**
     * Gets/sets the width of the drop down
     */
    @Input()
    get width() {
        return this._width;
    }
    set width(value) {
        this._width = value;
        this.toggleDirective.element.style.width = value;
    }

    /**
     * Gets/sets the height of the drop down
     */
    @Input()
    get height() {
        return this._height;
    }
    set height(value) {
        this._height = value;
        this.toggleDirective.element.style.height = value;
    }

    /**
     * Gets/sets whether items will be able to take focus. If set to true, default value,
     * user will be able to use keyboard navigation.
     */
    @Input()
    public allowItemsFocus = true;

    /**
     * Gets/sets the drop down's id
     */
    @Input()
    get id(): string {
        return this._id;
    }
    set id(value: string) {
        this._id = value;
        this.toggleDirective.id = value;
    }

    /**
     * Gets if the dropdown is collapsed
     */
    public get collapsed(): boolean {
        return this.toggleDirective.collapsed;
    }

    /**
     * Get currently selected item
     */
    public get selectedItem(): IgxDropDownItemComponent {
        const selection = this.selectionAPI.get_selection(this.id);
        return selection && selection.length > 0 ? selection[0] as IgxDropDownItemComponent : null;
    }

    /**
     * Get all non-header items
     */
    public get items(): IgxDropDownItemComponent[] {
        const items: IgxDropDownItemComponent[] = [];
        if (this.children !== undefined) {
            for (const child of this.children.toArray()) {
                if (!child.isHeader) {
                    items.push(child);
                }
            }
        }

        return items;
    }

    /**
     * Get all header items
     */
    public get headers(): IgxDropDownItemComponent[] {
        const headers: IgxDropDownItemComponent[] = [];
        if (this.children !== undefined) {
            for (const child of this.children.toArray()) {
                if (child.isHeader) {
                    headers.push(child);
                }
            }
        }

        return headers;
    }

    /**
     * Get dropdown html element
     */
    public get element() {
        return this.elementRef.nativeElement;
    }

    constructor(
        private elementRef: ElementRef,
        private cdr: ChangeDetectorRef,
        private selectionAPI: IgxSelectionAPIService) { }

    /**
     * Select an item by index
     * @param index of the item to select
     */
    setSelectedItem(index: number) {
        if (index < 0 || index >= this.items.length) {
            return;
        }

        const newSelection = this.items.find((item) => item.index === index);
        if (newSelection.isDisabled) {
            return;
        }

        this.changeSelectedItem(newSelection);
    }

    /**
     * Opens the dropdown
     */
    open(positionStrategy?: IPositionStrategy) {
        this.toggleDirective.open(true, positionStrategy);
    }

    /**
     * Closes the dropdown
     */
    close() {
        this.toggleDirective.close(true);
    }

    /**
     * Toggles the dropdown
     */
    toggle(positionStrategy?: IPositionStrategy) {
        if (this.toggleDirective.collapsed) {
            this.open(positionStrategy);
        } else {
            this.close();
        }
    }

    focusFirst() {
        if (this._focusedItem) {
            const focusedItemIndex = - 1;
            const firstItemIndex = this.getNearestSiblingFocusableItemIndex(focusedItemIndex, Direction.Down);
            if (firstItemIndex !== -1) {
                this.changeFocusedItem(this.items[firstItemIndex], this._focusedItem);
            }
        }
    }

    focusLast() {
        if (this._focusedItem) {
            const focusedItemIndex = (this.items.length);
            const lastItemIndex = this.getNearestSiblingFocusableItemIndex(focusedItemIndex, Direction.Up);
            if (lastItemIndex !== -1) {
                this.changeFocusedItem(this.items[lastItemIndex], this._focusedItem);
            }
        }
    }

    focusNext() {
        let focusedItemIndex = -1;
        if (this._focusedItem) {
            focusedItemIndex = this._focusedItem.index;
        }
        const nextItemIndex = this.getNearestSiblingFocusableItemIndex(focusedItemIndex, Direction.Down);
        if (nextItemIndex !== -1) {
            this.changeFocusedItem(this.items[nextItemIndex], this._focusedItem);
        }
    }

    focusPrev() {
        if (this._focusedItem) {
            const focusedItemIndex = this._focusedItem.index;
            const prevItemIndex = this.getNearestSiblingFocusableItemIndex(focusedItemIndex, Direction.Up);
            if (prevItemIndex !== -1) {
                this.changeFocusedItem(this.items[prevItemIndex], this._focusedItem);
            }
        }
    }

    ngOnInit() {
        this.toggleDirective.id = this.id;
    }

    onToggleOpening() {
        this.toggleDirective.collapsed = false;
        this.cdr.detectChanges();
        this.scrollToItem(this.selectedItem);
        this.onOpening.emit();
    }

    onToggleOpened() {
        this._initiallySelectedItem = this.selectedItem;
        this._focusedItem = this.selectedItem;
        if (this._focusedItem) {
            this._focusedItem.isFocused = true;
        } else if (this.allowItemsFocus) {
            const firstItemIndex = this.getNearestSiblingFocusableItemIndex(-1, Direction.Down);
            if (firstItemIndex !== -1) {
                this.changeFocusedItem(this.items[firstItemIndex]);
            }
        }
        this.onOpened.emit();
    }

    onToggleClosing() {
        this.onClosing.emit();
    }

    onToggleClosed() {
        if (this._focusedItem) {
            this._focusedItem.isFocused = false;
        }

        this.onClosed.emit();
    }

    private scrollToItem(item: IgxDropDownItemComponent) {
        const itemPosition = this.calculateScrollPosition(item);
        this.toggleDirective.element.scrollTop = (itemPosition);
    }

    private changeSelectedItem(newSelection?: IgxDropDownItemComponent) {
        const oldSelection = this.selectedItem;
        if (!newSelection) {
            newSelection = this._focusedItem;
        }

        this.selectionAPI.set_selection(this.id, [newSelection]);
        const args: ISelectionEventArgs = { oldSelection, newSelection };
        this.onSelection.emit(args);
    }

    private calculateScrollPosition(item: IgxDropDownItemComponent): number {
        if (!item) {
            return 0;
        }

        const elementRect = item.element.nativeElement.getBoundingClientRect();
        const parentRect = this.toggleDirective.element.getBoundingClientRect();
        const scrollDelta = parentRect.top - elementRect.top;
        let scrollPosition = this.toggleDirective.element.scrollTop - scrollDelta;

        const dropDownHeight = this.toggleDirective.element.clientHeight;
        scrollPosition -= dropDownHeight / 2;
        scrollPosition += item.elementHeight / 2;

        return Math.floor(scrollPosition);
    }

    private getNearestSiblingFocusableItemIndex(startIndex: number, direction: Direction): number {
        let index = startIndex;
        while (this.items[index + direction] && this.items[index + direction].isDisabled) {
            index += direction;
        }

        index += direction;
        if (index >= 0 && index < this.items.length) {
            return index;
        } else {
            return -1;
        }
    }

    private changeFocusedItem(newItem: IgxDropDownItemComponent, oldItem?: IgxDropDownItemComponent) {
        if (oldItem) {
            oldItem.isFocused = false;
        }

        this._focusedItem = newItem;
        const elementRect = this._focusedItem.element.nativeElement.getBoundingClientRect();
        const parentRect = this.toggleDirective.element.getBoundingClientRect();
        if (parentRect.top > elementRect.top) {
            this.toggleDirective.element.scrollTop -= (parentRect.top - elementRect.top);
        }

        if (parentRect.bottom < elementRect.bottom) {
            this.toggleDirective.element.scrollTop += (elementRect.bottom - parentRect.bottom);
        }

        this._focusedItem.isFocused = true;
    }
}

@NgModule({
    declarations: [IgxDropDownComponent, IgxDropDownItemComponent],
    exports: [IgxDropDownComponent, IgxDropDownItemComponent],
    imports: [CommonModule, IgxToggleModule],
    providers: [IgxSelectionAPIService]
})
export class IgxDropDownModule { }
