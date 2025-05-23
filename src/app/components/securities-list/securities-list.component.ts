import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
} from '@angular/material/table';
import { Observable, BehaviorSubject } from 'rxjs';
import { indicate } from '../../utils';
import { Security } from '../../models/security';
import { SecurityService } from '../../services/security.service';
import { FilterableTableComponent } from '../filterable-table/filterable-table.component';
import { AsyncPipe } from '@angular/common';
import { PagingFilter, SecuritiesFilter } from '../../models/securities-filter';

@Component({
  selector: 'securities-list',
  standalone: true,
  imports: [
    FilterableTableComponent,
    AsyncPipe,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatNoDataRow,
    MatRowDef,
    MatRow,
  ],
  templateUrl: './securities-list.component.html',
  styleUrl: './securities-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecuritiesListComponent {
  protected displayedColumns: string[] = ['name', 'type', 'currency'];
  protected filterFields: {
    key: string;
    label: string;
    type: 'text' | 'select' | 'boolean';
    options?: string[];
  }[] = [];

  protected totalItems: number = 0;
  protected paging: PagingFilter = {
    skip: 0,
    limit: 10
  };

  protected filters: SecuritiesFilter = {};
  private _securityService = inject(SecurityService);
  protected loadingSecurities$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  protected securities$: Observable<Security[]> = new Observable<Security[]>();

  constructor() {
    this.securities$ = this._securityService.getSecurities();
    this.securities$.subscribe((data) => {
      const types = this.getUniqueValues(data, 'type');
      const currencies = this.getUniqueValues(data, 'currency');

      this.totalItems = this._securityService.getTotalCount();

      this.filterFields = [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'types', label: 'Type', type: 'select', options: types },
        { key: 'currencies', label: 'Currency', type: 'select', options: currencies },
        { key: 'isPrivate', label: 'Private/Public Asset', type: 'boolean' },
      ];

      this.loadData();
    });
  }

  protected onFilterChange(newFilters: Record<string, any>) {
    this.filters = { ...newFilters };
    this.loadData();
  }

  protected onPageChange(paging: PagingFilter) {
    this.paging = paging;
    this.loadData();
  }

  private loadData(): void {
    const fullFilter = {
      ...this.filters,
      ...this.paging
    };

    this.securities$ = this._securityService
      .getSecurities(fullFilter)
      .pipe(indicate(this.loadingSecurities$));
    this.totalItems = this._securityService.getFilteredCount(fullFilter);
  }

  private getUniqueValues<T>(data: T[], key: keyof T): string[] {
    return Array.from(new Set(data.map(item => item[key]).filter(Boolean))) as string[];
  }
}