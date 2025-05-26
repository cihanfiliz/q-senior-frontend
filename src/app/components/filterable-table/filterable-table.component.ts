import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  Input,
  Output,
  EventEmitter,
  QueryList,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import {
  MatColumnDef,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FilterBarComponent } from '../filter-bar/filter-bar.component';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'filterable-table',
  standalone: true,
  imports: [MatProgressSpinner, MatTable, FilterBarComponent, CommonModule, MatPaginatorModule],
  templateUrl: './filterable-table.component.html',
  styleUrl: './filterable-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterableTableComponent<T> implements AfterContentInit {
  @ContentChildren(MatHeaderRowDef) headerRowDefs?: QueryList<MatHeaderRowDef>;
  @ContentChildren(MatRowDef) rowDefs?: QueryList<MatRowDef<T>>;
  @ContentChildren(MatColumnDef) columnDefs?: QueryList<MatColumnDef>;
  @ContentChild(MatNoDataRow) noDataRow?: MatNoDataRow;

  @ViewChild(MatTable, { static: true }) table?: MatTable<T>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output() paginatorReady = new EventEmitter<MatPaginator>();

  @Input() columns: string[] = [];

  @Input() dataSource:
    | readonly T[]
    | DataSource<T>
    | Observable<readonly T[]>
    | null = null;
  @Input() isLoading: boolean | null = false;
  @Input() filterFields: { key: string; label: string; type: 'text' | 'select' | 'boolean'; options?: string[] }[] = [];
  @Output() filterChange = new EventEmitter<Record<string, any>>();

  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Output() pageChange = new EventEmitter<{ skip: number; limit: number }>();

  onFilterChange(filters: Record<string, any>) {
    this.filterChange.emit(filters);
  }

  onPageChange(event: PageEvent) {
    this.pageChange.emit({
      skip: event.pageIndex * event.pageSize,
      limit: event.pageSize
    });
  }  

  public ngAfterViewInit() {
    this.paginatorReady.emit(this.paginator);
  }

  public ngAfterContentInit(): void {
    this.columnDefs?.forEach((columnDef) =>
      this.table?.addColumnDef(columnDef)
    );
    this.rowDefs?.forEach((rowDef) => this.table?.addRowDef(rowDef));
    this.headerRowDefs?.forEach((headerRowDef) =>
      this.table?.addHeaderRowDef(headerRowDef)
    );
    this.table?.setNoDataRow(this.noDataRow ?? null);
  }
}
