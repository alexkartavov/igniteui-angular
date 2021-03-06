import { Injectable } from '@angular/core';
import { IgxGridBaseComponent } from './grid-base.component';
import { first } from 'rxjs/operators';
import { IgxColumnComponent } from './column.component';
import { IgxGridRowComponent } from './grid/grid-row.component';

enum MoveDirection {
    LEFT = 'left',
    RIGHT = 'right'
}

/** @hidden */
@Injectable()
export class IgxGridNavigationService {
    public grid: IgxGridBaseComponent;

    get displayContainerWidth() {
        return parseInt(this.grid.parentVirtDir.dc.instance._viewContainer.element.nativeElement.offsetWidth, 10);
    }

    get displayContainerScrollLeft() {
        return parseInt(this.grid.parentVirtDir.getHorizontalScroll().scrollLeft, 10);
    }

    get verticalDisplayContainerElement() {
        return this.grid.verticalScrollContainer.dc.instance._viewContainer.element.nativeElement;
    }

    public horizontalScroll(rowIndex) {
        return this.grid.dataRowList.find((row) => row.index === rowIndex).virtDirRow;
    }

    public getColumnUnpinnedIndex(visibleColumnIndex: number) {
        const column = this.grid.unpinnedColumns.find((col) => !col.columnGroup && col.visibleIndex === visibleColumnIndex);
        return this.grid.pinnedColumns.length ? this.grid.unpinnedColumns.filter((c) => !c.columnGroup).indexOf(column) :
            visibleColumnIndex;
    }

    public isColumnFullyVisible(visibleColumnIndex: number) {
        let forOfDir;
        if (this.grid.dataRowList.length > 0) {
            forOfDir = this.grid.dataRowList.first.virtDirRow;
        } else {
            forOfDir = this.grid.headerContainer;
        }
        const horizontalScroll = forOfDir.getHorizontalScroll();
        if (!horizontalScroll.clientWidth ||
            this.grid.columnList.filter(c => !c.columnGroup).find((column) => column.visibleIndex === visibleColumnIndex).pinned) {
            return true;
        }
        const index = this.getColumnUnpinnedIndex(visibleColumnIndex);
        return this.displayContainerWidth >= forOfDir.getColumnScrollLeft(index + 1) - this.displayContainerScrollLeft;
    }

    public isColumnLeftFullyVisible(visibleColumnIndex) {
        let forOfDir;
        if (this.grid.dataRowList.length > 0) {
            forOfDir = this.grid.dataRowList.first.virtDirRow;
        } else {
            forOfDir = this.grid.headerContainer;
        }
        const horizontalScroll = forOfDir.getHorizontalScroll();
        if (!horizontalScroll.clientWidth ||
            this.grid.columnList.filter(c => !c.columnGroup).find((column) => column.visibleIndex === visibleColumnIndex).pinned) {
            return true;
        }
        const index = this.getColumnUnpinnedIndex(visibleColumnIndex);
        return this.displayContainerScrollLeft <= forOfDir.getColumnScrollLeft(index);
    }

    public get gridOrderedColumns(): IgxColumnComponent[] {
        return [...this.grid.pinnedColumns, ...this.grid.unpinnedColumns].filter(c => !c.columnGroup);
    }

    public isRowInEditMode(rowIndex): boolean {
        return this.grid.rowEditable && (this.grid.rowInEditMode && this.grid.rowInEditMode.index === rowIndex);
    }

    public isColumnEditable(visibleColumnIndex: number): boolean {
        const column = this.gridOrderedColumns.find(c => c.visibleIndex === visibleColumnIndex);
        return column ? column.editable : false;
    }

    public findNextEditable(direction: string, visibleColumnIndex: number) {
        const gridColumns = this.gridOrderedColumns;
        if (direction === MoveDirection.LEFT) {
            return gridColumns.splice(0, visibleColumnIndex + 1).reverse().findIndex(e => e.editable);
        } else if (direction === MoveDirection.RIGHT) {
            return gridColumns.splice(visibleColumnIndex, gridColumns.length - 1).findIndex(e => e.editable);
        }
    }

    public getCellElementByVisibleIndex(rowIndex, visibleColumnIndex) {
        if (this.isTreeGrid && visibleColumnIndex === 0) {
            return this.grid.nativeElement.querySelector(
                `igx-tree-grid-cell[data-rowindex="${rowIndex}"][data-visibleIndex="${visibleColumnIndex}"]`);
        }
        return this.grid.nativeElement.querySelector(
            `igx-grid-cell[data-rowindex="${rowIndex}"][data-visibleIndex="${visibleColumnIndex}"]`);
    }

    public onKeydownArrowRight(element, rowIndex, visibleColumnIndex) {
        if (this.grid.unpinnedColumns[this.grid.unpinnedColumns.length - 1].visibleIndex === visibleColumnIndex) {
            return;
        }
        if (this.isColumnFullyVisible(visibleColumnIndex + 1)) { // if next column is fully visible or is pinned
            if (element.classList.contains('igx-grid__th--pinned-last')) {
                if (this.isColumnLeftFullyVisible(visibleColumnIndex + 1)) {
                    element.nextElementSibling.firstElementChild.focus();
                } else {
                    this.grid.nativeElement.focus({preventScroll: true});
                    this.grid.parentVirtDir.onChunkLoad
                        .pipe(first())
                        .subscribe(() => {
                            element.nextElementSibling.firstElementChild.focus();
                        });
                        this.horizontalScroll(rowIndex).scrollTo(0);
                }
            } else {
                element.nextElementSibling.focus();
            }
        } else {
            this.grid.nativeElement.focus({preventScroll: true});
            this.performHorizontalScrollToCell(rowIndex, visibleColumnIndex + 1);
        }
    }

    public onKeydownArrowLeft(element, rowIndex, visibleColumnIndex) {
        if (visibleColumnIndex === 0) {
            return;
        }
        const index = this.getColumnUnpinnedIndex(visibleColumnIndex - 1);
        if (!element.previousElementSibling && this.grid.pinnedColumns.length && index === - 1) {
            element.parentNode.previousElementSibling.focus();
        } else if (!this.isColumnLeftFullyVisible(visibleColumnIndex - 1)) {
            this.grid.nativeElement.focus({preventScroll: true});
            this.performHorizontalScrollToCell(rowIndex, visibleColumnIndex - 1);
        } else {
            element.previousElementSibling.focus();
        }

    }

    public movePreviousEditable(rowIndex, visibleColumnIndex) {
        const addedIndex = this.isColumnEditable(visibleColumnIndex - 1) ?
            0 :
            this.findNextEditable(MoveDirection.LEFT, visibleColumnIndex - 1);
        if (addedIndex === -1) {
            this.grid.rowEditTabs.last.element.nativeElement.focus();
            return;
        }
        const editableIndex = visibleColumnIndex - 1 - addedIndex;
        if (this.getColumnUnpinnedIndex(editableIndex) === -1 && this.grid.pinnedColumns.length) {
            // if target is NOT pinned and there are pinned columns
            // since addedIndex !== -1, there will always be a target
            this.getCellElementByVisibleIndex(rowIndex, editableIndex).focus();
        } else if (!this.isColumnLeftFullyVisible(editableIndex)) {  // if not fully visible, perform scroll
            this.grid.nativeElement.focus({preventScroll: true});
            this.performHorizontalScrollToCell(rowIndex, editableIndex);
        } else {
            this.getCellElementByVisibleIndex(rowIndex, editableIndex).focus(); // if fully visible, just focus
        }
    }

    public moveNextEditable(element, rowIndex, visibleColumnIndex) {
        let addedIndex = 0;
        addedIndex = this.isColumnEditable(visibleColumnIndex + 1) ?
                0 :
        this.findNextEditable(MoveDirection.RIGHT, visibleColumnIndex + 1);
        if (addedIndex === -1 && this.grid.rowEditTabs) { // no previous edit column -> go to RE buttons
            this.grid.rowEditTabs.first.element.nativeElement.focus();
            return;
        }
        const editableIndex = visibleColumnIndex + 1 + addedIndex;
        if (this.isColumnFullyVisible(editableIndex)) { // If column is fully visible
            if (element.classList.contains('igx-grid__th--pinned-last')) { // If this is pinned
                if (this.isColumnLeftFullyVisible(editableIndex)) { // If next column is fully visible LEFT
                    this.getCellElementByVisibleIndex(rowIndex, editableIndex).focus(); // focus
                } else { // if NOT fully visible, perform scroll
                    this.grid.nativeElement.focus({preventScroll: true});
                    this.performHorizontalScrollToCell(rowIndex, editableIndex);
                }
            } else { // cell is next cell
                this.getCellElementByVisibleIndex(rowIndex, editableIndex).focus();
            }
        } else {
            this.grid.nativeElement.focus({preventScroll: true});
            this.performHorizontalScrollToCell(rowIndex, editableIndex);
        }
    }
    public onKeydownHome(rowIndex) {
        const rowElement = this.grid.dataRowList.find((row) => row.index === rowIndex).nativeElement;
        let firstCell = this.isTreeGrid ?
        rowElement.querySelector('igx-tree-grid-cell') :
        rowElement.querySelector('igx-grid-cell');
        if (this.grid.pinnedColumns.length || this.displayContainerScrollLeft === 0) {
            firstCell.focus();
        } else {
            this.grid.parentVirtDir.onChunkLoad
                .pipe(first())
                .subscribe(() => {
                    this.grid.nativeElement.focus({preventScroll: true});
                    firstCell = this.isTreeGrid ? rowElement.querySelector('igx-tree-grid-cell') :
                    rowElement.querySelector('igx-grid-cell');
                    firstCell.focus();
                });
            this.horizontalScroll(rowIndex).scrollTo(0);
        }
    }

    public onKeydownEnd(rowIndex) {
        const index = this.grid.unpinnedColumns[this.grid.unpinnedColumns.length - 1].visibleIndex;
        const rowElement = this.grid.dataRowList.find((row) => row.index === rowIndex).nativeElement;
        const allCells = rowElement.querySelectorAll('igx-grid-cell');
        const lastCell = allCells[allCells.length - 1];
        if (this.isColumnFullyVisible(index)) {
            lastCell.focus();
        } else {
            this.grid.parentVirtDir.onChunkLoad
                .pipe(first())
                .subscribe(() => {
                    this.grid.nativeElement.focus({preventScroll: true});
                    lastCell.focus();
                });
            this.horizontalScroll(rowIndex).scrollTo(this.getColumnUnpinnedIndex(index));
        }
    }

    public navigateTop(visibleColumnIndex) {
        const verticalScroll = this.grid.verticalScrollContainer.getVerticalScroll();
        const cellSelector = this.isTreeGrid && visibleColumnIndex === 0 ? 'igx-tree-grid-cell' : 'igx-grid-cell';
        if (verticalScroll.scrollTop === 0) {
            const cells = this.grid.nativeElement.querySelectorAll(
                `${cellSelector}[data-visibleIndex="${visibleColumnIndex}"]`);
            cells[0].focus();
        } else {
            this.grid.nativeElement.focus({preventScroll: true});
            this.grid.verticalScrollContainer.scrollTo(0);
            this.grid.verticalScrollContainer.onChunkLoad
                .pipe(first()).subscribe(() => {
                    const cells = this.grid.nativeElement.querySelectorAll(
                        `${cellSelector}[data-visibleIndex="${visibleColumnIndex}"]`);
                    if (cells.length > 0) { cells[0].focus(); }
                });
        }
    }

    public navigateBottom(visibleColumnIndex) {
        const verticalScroll = this.grid.verticalScrollContainer.getVerticalScroll();
        const cellSelector = this.isTreeGrid && visibleColumnIndex === 0 ? 'igx-tree-grid-cell' : 'igx-grid-cell';
        if (verticalScroll.scrollTop === verticalScroll.scrollHeight - this.grid.verticalScrollContainer.igxForContainerSize) {
            const cells = this.grid.nativeElement.querySelectorAll(
                `${cellSelector}[data-visibleIndex="${visibleColumnIndex}"]`);
            cells[cells.length - 1].focus();
        } else {
            this.grid.nativeElement.focus({preventScroll: true});
            this.grid.verticalScrollContainer.scrollTo(this.grid.verticalScrollContainer.igxForOf.length - 1);
            this.grid.verticalScrollContainer.onChunkLoad
                .pipe(first()).subscribe(() => {
                    const cells = this.grid.nativeElement.querySelectorAll(
                        `${cellSelector}[data-visibleIndex="${visibleColumnIndex}"]`);
                    if (cells.length > 0) { cells[cells.length - 1].focus(); }
                });
        }
    }

    public navigateUp(rowElement, currentRowIndex, visibleColumnIndex) {
        if (currentRowIndex === 0) {
            return;
        }
        const containerTopOffset = parseInt(this.verticalDisplayContainerElement.style.top, 10);
        if (!rowElement.previousElementSibling ||
            rowElement.previousElementSibling.offsetTop < Math.abs(containerTopOffset)) {
            this.grid.nativeElement.focus({ preventScroll: true });
            this.grid.verticalScrollContainer.scrollTo(currentRowIndex - 1);
            this.grid.verticalScrollContainer.onChunkLoad
                .pipe(first())
                .subscribe(() => {
                    const tag = rowElement.tagName.toLowerCase();
                    if (tag === 'igx-grid-row' || tag === 'igx-tree-grid-row') {
                        rowElement = this.getRowByIndex(currentRowIndex);
                    } else {
                        rowElement = this.grid.nativeElement.querySelector(
                            `igx-grid-groupby-row[data-rowindex="${currentRowIndex}"]`);
                    }
                    this.focusPreviousElement(rowElement, visibleColumnIndex);
                });
        } else {
            this.focusPreviousElement(rowElement, visibleColumnIndex);
        }
    }

    private focusPreviousElement(currentRowEl, visibleColumnIndex) {
        if (currentRowEl.previousElementSibling.tagName.toLowerCase() === 'igx-grid-groupby-row') {
            currentRowEl.previousElementSibling.focus();
        } else {
            if (this.isColumnFullyVisible(visibleColumnIndex) && this.isColumnLeftFullyVisible(visibleColumnIndex)) {
                const cell = this.isTreeGrid && visibleColumnIndex === 0 ?
                currentRowEl.previousElementSibling.querySelector(`igx-tree-grid-cell[data-visibleIndex="${visibleColumnIndex}"]`) :
                currentRowEl.previousElementSibling.querySelector(`igx-grid-cell[data-visibleIndex="${visibleColumnIndex}"]`);
                cell.focus();
                return;
            }
            this.grid.nativeElement.focus({preventScroll: true});
            this.performHorizontalScrollToCell(parseInt(
                currentRowEl.previousElementSibling.getAttribute('data-rowindex'), 10), visibleColumnIndex);
            }
        }

    public navigateDown(rowElement, currentRowIndex, visibleColumnIndex) {
        if (currentRowIndex === this.grid.verticalScrollContainer.igxForOf.length - 1) {
            return;
        }
        const rowHeight = this.grid.verticalScrollContainer.getSizeAt(currentRowIndex + 1);
        const containerHeight = this.grid.calcHeight ? Math.ceil(this.grid.calcHeight) : 0;
        const targetEndTopOffset = rowElement.nextElementSibling ?
        rowElement.nextElementSibling.offsetTop + rowHeight + parseInt(this.verticalDisplayContainerElement.style.top, 10) :
        containerHeight + rowHeight;
        this.grid.nativeElement.focus({preventScroll: true});
        if (containerHeight && containerHeight < targetEndTopOffset) {
            this.grid.verticalScrollContainer.scrollTo(currentRowIndex + 1);
            this.grid.verticalScrollContainer.onChunkLoad
                .pipe(first())
                .subscribe(() => {
                    const tag = rowElement.tagName.toLowerCase();
                    if (tag === 'igx-grid-row' || tag === 'igx-tree-grid-row') {
                        rowElement = this.getRowByIndex(currentRowIndex);
                    } else {
                        rowElement = this.grid.nativeElement.querySelector(
                            `igx-grid-groupby-row[data-rowindex="${currentRowIndex}"]`);
                    }
                    this.focusNextElement(rowElement, visibleColumnIndex);
                });
        } else {
            this.focusNextElement(rowElement, visibleColumnIndex);
        }
    }

    private focusNextElement(rowElement, visibleColumnIndex) {
        if (rowElement.nextElementSibling.tagName.toLowerCase() === 'igx-grid-groupby-row') {
            rowElement.nextElementSibling.focus();
        } else {
            if (this.isColumnFullyVisible(visibleColumnIndex) && this.isColumnLeftFullyVisible(visibleColumnIndex)) {
                const cell = this.isTreeGrid && visibleColumnIndex === 0 ?
                rowElement.nextElementSibling.querySelector(`igx-tree-grid-cell[data-visibleIndex="${visibleColumnIndex}"]`) :
                rowElement.nextElementSibling.querySelector(`igx-grid-cell[data-visibleIndex="${visibleColumnIndex}"]`);
                cell.focus();
                return;
            }
            this.performHorizontalScrollToCell(parseInt(
                rowElement.nextElementSibling.getAttribute('data-rowindex'), 10), visibleColumnIndex);
            }
        }

    public goToFirstCell() {
        const verticalScroll = this.grid.verticalScrollContainer.getVerticalScroll();
        const horizontalScroll = this.grid.dataRowList.first.virtDirRow.getHorizontalScroll();
        if (verticalScroll.scrollTop === 0) {
            if (!this.isTreeGrid) {
                this.onKeydownHome(this.grid.dataRowList.first.index);
            } else {
                this.onKeydownHome(0);
            }
        } else {
            if (!horizontalScroll.clientWidth || parseInt(horizontalScroll.scrollLeft, 10) <= 1 || this.grid.pinnedColumns.length) {
                this.navigateTop(0);
            } else {
                this.horizontalScroll(this.grid.dataRowList.first.index).scrollTo(0);
                this.grid.parentVirtDir.onChunkLoad
                    .pipe(first())
                    .subscribe(() => {
                        this.navigateTop(0);
                    });
            }
        }
    }

    public goToLastCell() {
        const verticalScroll = this.grid.verticalScrollContainer.getVerticalScroll();
        if (verticalScroll.scrollTop === verticalScroll.scrollHeight - this.grid.verticalScrollContainer.igxForContainerSize) {
            const rows = this.getAllRows();
            const rowIndex = parseInt(rows[rows.length - 1].getAttribute('data-rowIndex'), 10);
            this.onKeydownEnd(rowIndex);
        } else {
            this.grid.verticalScrollContainer.scrollTo(this.grid.verticalScrollContainer.igxForOf.length - 1);
            this.grid.verticalScrollContainer.onChunkLoad
                .pipe(first()).subscribe(() => {
                    const rows = this.getAllRows();
                if (rows.length > 0) {
                    const rowIndex = parseInt(rows[rows.length - 1].getAttribute('data-rowIndex'), 10);
                    this.onKeydownEnd(rowIndex);
                }
                });
        }
    }

    public performTab(currentRowEl, rowIndex, visibleColumnIndex) {
        if (this.grid.unpinnedColumns[this.grid.unpinnedColumns.length - 1].visibleIndex === visibleColumnIndex) {
            if (this.isRowInEditMode(rowIndex)) {
                this.grid.rowEditTabs.first.element.nativeElement.focus();
                return;
            }
            if (this.grid.rowList.find(row => row.index === rowIndex + 1)) {
                this.navigateDown(currentRowEl, rowIndex, 0);
            }
        } else {
            const cell = this.getCellElementByVisibleIndex(rowIndex, visibleColumnIndex);
            if (cell) {
                if (this.grid.rowEditable && this.isRowInEditMode(rowIndex)) {
                    this.moveNextEditable(cell, rowIndex, visibleColumnIndex);
                    return;
                }
                this.onKeydownArrowRight(cell, rowIndex, visibleColumnIndex);
            }
        }
    }

    public moveFocusToFilterCell() {
        this.grid.rowList.find(row => row instanceof  IgxGridRowComponent).cells.first._clearCellSelection();
        const visColLength = this.grid.unpinnedColumns.length;
        if (this.isColumnFullyVisible(visColLength - 1)) {
            const lastFilterCellIndex = this.grid.filterCellList.length - 1;
            this.grid.filteringService.focusFilterCellChip(this.grid.filterCellList[lastFilterCellIndex].column, false);
        } else {
            this.grid.filteringService.columnToFocus = this.grid.unpinnedColumns[visColLength - 1];
            this.grid.filteringService.shouldFocusNext = false;
            this.grid.headerContainer.scrollTo(visColLength - 1);
        }
    }

    public performShiftTabKey(currentRowEl, rowIndex, visibleColumnIndex) {
        if (visibleColumnIndex === 0) {
                if (this.isRowInEditMode(rowIndex)) {
                    this.grid.rowEditTabs.last.element.nativeElement.focus();
                    return;
                }
                if (rowIndex === 0 && this.grid.allowFiltering) {
                    this.moveFocusToFilterCell();
                } else {
                    this.navigateUp(currentRowEl, rowIndex,
                        this.grid.unpinnedColumns[this.grid.unpinnedColumns.length - 1].visibleIndex);
                }
        } else {
            const cell = currentRowEl.querySelector(`igx-grid-cell[data-visibleIndex="${visibleColumnIndex}"]`);
            if (cell) {
                if (this.grid.rowEditable && this.isRowInEditMode(rowIndex)) {
                    this.movePreviousEditable( rowIndex, visibleColumnIndex);
                    return;
                }
                this.onKeydownArrowLeft(cell, rowIndex, visibleColumnIndex);
            }
        }
    }

    private performHorizontalScrollToCell(rowIndex, visibleColumnIndex) {
        const unpinnedIndex = this.getColumnUnpinnedIndex(visibleColumnIndex);
        this.grid.parentVirtDir.onChunkLoad
            .pipe(first())
            .subscribe(() => {
                this.getCellElementByVisibleIndex(rowIndex, visibleColumnIndex).focus();
            });
        this.horizontalScroll(rowIndex).scrollTo(unpinnedIndex);
    }
    private getRowByIndex(index) {
        return this.isTreeGrid ? this.grid.nativeElement.querySelector(
            `igx-tree-grid-row[data-rowindex="${index}"]`) :
            this.grid.nativeElement.querySelector(
                `igx-grid-row[data-rowindex="${index}"]`);
    }

    private getAllRows() {
        return this.isTreeGrid ? this.grid.nativeElement.querySelectorAll('igx-tree-grid-row') :
        this.grid.nativeElement.querySelectorAll('igx-grid-row');
    }

    private get isTreeGrid() {
        return this.grid.nativeElement.tagName.toLowerCase() === 'igx-tree-grid';
    }
}
