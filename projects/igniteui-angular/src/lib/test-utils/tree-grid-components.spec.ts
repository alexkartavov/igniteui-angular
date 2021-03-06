import { Component, ViewChild } from '@angular/core';
import { IgxTreeGridComponent } from '../grids/tree-grid/tree-grid.component';
import { SampleTestData } from './sample-test-data.spec';

@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" childDataKey="Employees" width="900px" height="600px">
        <igx-column [field]="'ID'" dataType="number" [sortable]="true"></igx-column>
        <igx-column [field]="'Name'" dataType="string" [sortable]="true"></igx-column>
        <igx-column [field]="'HireDate'" dataType="date" [sortable]="true"></igx-column>
        <igx-column [field]="'Age'" dataType="number" [sortable]="true"></igx-column>
    </igx-tree-grid>
    `
})
export class IgxTreeGridSortingComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeSmallTreeData();
}

@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" childDataKey="Employees" expansionDepth="2" width="900px" height="600px">
        <igx-column [field]="'ID'" dataType="number" [filterable]="true"></igx-column>
        <igx-column [field]="'Name'" dataType="string" [filterable]="true"></igx-column>
        <igx-column [field]="'HireDate'" dataType="date" [filterable]="true"></igx-column>
        <igx-column [field]="'Age'" dataType="number" [filterable]="true"></igx-column>
    </igx-tree-grid>
    `
})
export class IgxTreeGridFilteringComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeTreeData();
}

@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" childDataKey="Employees" primaryKey="ID" width="900px" height="600px">
        <igx-column [field]="'ID'" dataType="number"></igx-column>
        <igx-column [field]="'Name'" dataType="string"></igx-column>
        <igx-column [field]="'HireDate'" dataType="date"></igx-column>
        <igx-column [field]="'Age'" dataType="number"></igx-column>
    </igx-tree-grid>
    `
})
export class IgxTreeGridSimpleComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeSmallTreeData();
}

@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" childDataKey="Employees" primaryKey="ID" width="300px" height="400px" columnWidth="100px">
        <igx-column [field]="'ID'" dataType="number"></igx-column>
        <igx-column [field]="'Name'" dataType="string"></igx-column>
        <igx-column [field]="'HireDate'" dataType="date"></igx-column>
        <igx-column [field]="'Age'" dataType="number"></igx-column>
        <igx-column [field]="'OnPTO'" dataType="boolean"></igx-column>
    </igx-tree-grid>
    `
})
export class IgxTreeGridWithScrollsComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeAllTypesTreeData();
}

@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" childDataKey="Employees" primaryKey="ID" width="600px" height="600px" columnWidth="100px">
        <igx-column [field]="'ID'" dataType="number"></igx-column>
        <igx-column [field]="'Name'" dataType="string"></igx-column>
        <igx-column [field]="'HireDate'" dataType="date"></igx-column>
        <igx-column [field]="'Age'" dataType="number"></igx-column>
        <igx-column [field]="'OnPTO'" dataType="boolean"></igx-column>
    </igx-tree-grid>
    `
})
export class IgxTreeGridWithNoScrollsComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeAllTypesTreeData();
}

@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" primaryKey="ID" foreignKey="ParentID" width="900px" height="600px">
        <igx-column [field]="'ID'" dataType="number"></igx-column>
        <igx-column [field]="'ParentID'" dataType="number"></igx-column>
        <igx-column [field]="'Name'" dataType="string"></igx-column>
        <igx-column [field]="'JobTitle'" dataType="string"></igx-column>
        <igx-column [field]="'Age'" dataType="number"></igx-column>
    </igx-tree-grid>
    `
})
export class IgxTreeGridPrimaryForeignKeyComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeePrimaryForeignKeyTreeData();
}

@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" childDataKey="Employees" expansionDepth="0" width="900px" height="600px"
        [paging]="true" [perPage]="10">
        <igx-column [field]="'ID'" dataType="number"></igx-column>
        <igx-column [field]="'Name'" dataType="string"></igx-column>
        <igx-column [field]="'HireDate'" dataType="date"></igx-column>
        <igx-column [field]="'Age'" dataType="number"></igx-column>
    </igx-tree-grid>
    `
})
export class IgxTreeGridExpandingComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeTreeData();
}

@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" primaryKey="ID" childDataKey="Employees" expansionDepth="2" width="900px" height="500px"
        [paging]="true" [perPage]="10">
        <igx-column [field]="'ID'" dataType="number"></igx-column>
        <igx-column [field]="'Name'" dataType="string"></igx-column>
        <igx-column [field]="'HireDate'" dataType="date"></igx-column>
        <igx-column [field]="'Age'" dataType="number"></igx-column>
    </igx-tree-grid>
    `
})
export class IgxTreeGridCellSelectionComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeTreeData();
}

// Test Component with 'string' dataType tree-column
@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" childDataKey="Employees" width="900px" height="600px">
        <igx-column [field]="'Name'" dataType="string"></igx-column>
        <igx-column [field]="'ID'" dataType="number"></igx-column>
        <igx-column [field]="'HireDate'" dataType="date"></igx-column>
        <igx-column [field]="'Age'" dataType="number"></igx-column>
    </igx-tree-grid>
    `
})
export class IgxTreeGridStringTreeColumnComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeSmallTreeData();
}

// Test Component with 'date' dataType tree-column
@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" childDataKey="Employees" width="900px" height="600px">
        <igx-column [field]="'HireDate'" dataType="date"></igx-column>
        <igx-column [field]="'Name'" dataType="string"></igx-column>
        <igx-column [field]="'ID'" dataType="number"></igx-column>
        <igx-column [field]="'Age'" dataType="number"></igx-column>
    </igx-tree-grid>
    `
})
export class IgxTreeGridDateTreeColumnComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeSmallTreeData();
}

// Test Component with 'boolean' dataType tree-column
@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" childDataKey="Employees" width="900px" height="600px">
        <igx-column [field]="'OnPTO'" dataType="boolean"></igx-column>
        <igx-column [field]="'HireDate'" dataType="date"></igx-column>
        <igx-column [field]="'Name'" dataType="string"></igx-column>
        <igx-column [field]="'ID'" dataType="number"></igx-column>
        <igx-column [field]="'Age'" dataType="number"></igx-column>
    </igx-tree-grid>
    `
})
export class IgxTreeGridBooleanTreeColumnComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeAllTypesTreeData();
}

// Test Component for CRUD tests
@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" primaryKey="ID" childDataKey="Employees" expansionDepth="2" width="900px" height="600px">
        <igx-column [field]="'ID'" dataType="number" [editable]="true"></igx-column>
        <igx-column [field]="'Name'" dataType="string" [editable]="true"></igx-column>
        <igx-column [field]="'HireDate'" dataType="date" [editable]="true"></igx-column>
        <igx-column [field]="'Age'" dataType="number" [editable]="true"></igx-column>
        <igx-column [field]="'OnPTO'" dataType="boolean" [editable]="true"></igx-column>
    </igx-tree-grid>
    `
})
export class IgxTreeGridCrudComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeTreeData();
}

// Test Component for tree-grid row editing
@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" primaryKey="ID" [rowEditable]='true' childDataKey="Employees" width="900px" height="600px">
        <igx-column [field]="'HireDate'" dataType="date"></igx-column>
        <igx-column [field]="'Name'" dataType="string"></igx-column>
        <igx-column [field]="'ID'" dataType="number"></igx-column>
        <igx-column [field]="'Age'" dataType="number"></igx-column>
    </igx-tree-grid>
    `
})
export class IgxTreeGridRowEditingComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeSmallTreeData();
}

// Test Component for tree-grid filtering and row editing
@Component({
    template: `
        <igx-tree-grid #treeGrid [data]="data" childDataKey="Employees" [rowEditable]="true" width="900px" height="600px">
            <igx-column [field]="'HireDate'" dataType="date" [sortable]="true" [filterable]="true"></igx-column>
            <igx-column [field]="'Name'" dataType="string" [sortable]="true" [filterable]="true"></igx-column>
            <igx-column [field]="'ID'" dataType="number" [sortable]="true" [filterable]="true"></igx-column>
            <igx-column [field]="'Age'" dataType="number" [sortable]="true" [filterable]="true"></igx-column>
        </igx-tree-grid>
    `
})
export class IgxTreeGridFilteringRowEditingComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeTreeData();
}

@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" childDataKey="Employees" primaryKey="ID" width="900px" height="600px">
        <igx-column [editable]="true" [field]="'ID'" dataTtype="number"></igx-column>
        <igx-column [editable]="true" [field]="'Name'" dataType="string"></igx-column>
        <igx-column [editable]="true" [field]="'HireDate'" dataType="date"></igx-column>
        <igx-column [editable]="true" [field]="'Age'" dataType="number"></igx-column>
    </igx-tree-grid>
    `
})
export class IgxTreeGridSelectionRowEditingComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeTreeData();
}

@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" childDataKey="Employees" primaryKey="ID" width="900px" height="600px">
        <igx-column-group header="General Information" >
            <igx-column [field]="'ID'" dataType="number"></igx-column>
            <igx-column [field]="'Name'" dataType="string"></igx-column>
        </igx-column-group>
        <igx-column-group header="Additional Information">
            <igx-column [field]="'HireDate'" dataType="date"></igx-column>
            <igx-column [field]="'Age'" dataType="number"></igx-column>
        </igx-column-group>
    </igx-tree-grid>
    `
})
export class IgxTreeGridMultiColHeadersComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeSmallTreeData();
}
