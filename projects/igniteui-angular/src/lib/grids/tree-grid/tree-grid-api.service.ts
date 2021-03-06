import { GridBaseAPIService } from '../api.service';
import { IgxTreeGridComponent } from './tree-grid.component';
import { DataType } from '../../data-operations/data-util';
import { ITreeGridRecord } from './tree-grid.interfaces';
import { IRowToggleEventArgs } from './tree-grid.interfaces';
import { IgxColumnComponent } from '../column.component';
import { first } from 'rxjs/operators';

export class IgxTreeGridAPIService extends GridBaseAPIService<IgxTreeGridComponent> {
    public get_all_data(id: string, transactions?: boolean): any[] {
        const grid = this.get(id);
        const data = transactions ? grid.dataWithAddedInTransactionRows : grid.flatData;
        return data ? data : [];
    }

    public expand_row(id: string, rowID: any) {
        const grid = this.get(id);
        const expandedStates = grid.expansionStates;
        expandedStates.set(rowID, true);
        grid.expansionStates = expandedStates;
        if (grid.rowEditable) {
            grid.endEdit(true);
        }
    }

    public collapse_row(id: string, rowID: any) {
        const grid = this.get(id);
        const expandedStates = grid.expansionStates;
        expandedStates.set(rowID, false);
        grid.expansionStates = expandedStates;
        if (grid.rowEditable) {
            grid.endEdit(true);
        }
    }

    public toggle_row_expansion(id: string, rowID: any) {
        const grid = this.get(id);
        const expandedStates = grid.expansionStates;
        const treeRecord = grid.records.get(rowID);

        if (treeRecord) {
            const isExpanded = this.get_row_expansion_state(id, rowID, treeRecord.level);
            expandedStates.set(rowID, !isExpanded);
            grid.expansionStates = expandedStates;
        }
        if (grid.rowEditable) {
            grid.endEdit(true);
        }
    }

    public trigger_row_expansion_toggle(id: string, row: ITreeGridRecord, expanded: boolean, event?: Event, visibleColumnIndex?) {
        const grid = this.get(id);

        if (!row.children || row.children.length <= 0 && row.expanded === expanded) {
            return;
        }

        const args: IRowToggleEventArgs = {
            rowID: row.rowID,
            expanded: expanded,
            event: event,
            cancel: false
        };
        grid.onRowToggle.emit(args);

        if (args.cancel) {
            return;
        }
        visibleColumnIndex = visibleColumnIndex ? visibleColumnIndex : 0;
        const groupRowIndex = super.get_row_by_key(id, row.rowID).index;
        const shouldScroll = !(grid.unpinnedWidth - grid.totalWidth >= 0);
        const isScrolledToBottom = grid.rowList.length > 0 && grid.rowList.last.index ===
        grid.verticalScrollContainer.igxForOf.length - 1;
        const expandedStates = grid.expansionStates;
        expandedStates.set(row.rowID, expanded);
        grid.expansionStates = expandedStates;

        if (isScrolledToBottom) {
            grid.nativeElement.focus({preventScroll: true});
            grid.verticalScrollContainer.onChunkLoad
                .pipe(first())
                .subscribe(() => {
                    grid.nativeElement.querySelector(
                        `[data-rowIndex="${groupRowIndex}"][data-visibleindex="${visibleColumnIndex}"]`).focus();
                });
        }
        if (expanded || (!expanded && isScrolledToBottom)) {
            grid.verticalScrollContainer.getVerticalScroll().dispatchEvent(new Event('scroll'));
            if (shouldScroll) {
                grid.parentVirtDir.getHorizontalScroll().dispatchEvent(new Event('scroll'));
            }
        }
        if (grid.rowEditable) {
            grid.endEdit(true);
        }
    }

    public get_row_expansion_state(id: string, rowID: any, indentationLevel: number): boolean {
        const grid = this.get(id);
        const states = grid.expansionStates;
        const expanded = states.get(rowID);

        if (expanded !== undefined) {
            return expanded;
        } else {
            return indentationLevel < grid.expansionDepth;
        }
    }

    protected update_row_in_array(id: string, value: any, rowID: any, index: number) {
        const grid = this.get(id);
        if (grid.primaryKey && grid.foreignKey) {
            super.update_row_in_array(id, value, rowID, index);
        } else {
            const record = grid.records.get(rowID);
            const childData = record.parent ? record.parent.data[grid.childDataKey] : grid.data;
            index = grid.primaryKey ? childData.map(c => c[grid.primaryKey]).indexOf(rowID) :
                childData.indexOf(rowID);
            childData[index] = value;
        }
    }

    public should_apply_number_style(column: IgxColumnComponent): boolean {
        return column.dataType === DataType.Number && column.visibleIndex !== 0;
    }
}
