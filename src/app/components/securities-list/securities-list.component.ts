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
import { SecuritiesFilter } from '../../models/securities-filter';

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

  protected filters: SecuritiesFilter = {};
  private _securityService = inject(SecurityService);
  protected loadingSecurities$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  protected securities$: Observable<Security[]> =
    this._securityService
      .getSecurities(this.filters)
      .pipe(indicate(this.loadingSecurities$));

  constructor() {
    this.securities$.subscribe((data) => {
      const types = this.getUniqueValues(data, 'type');
      const currencies = this.getUniqueValues(data, 'currency');

      this.filterFields = [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'types', label: 'Type', type: 'select', options: types },
        { key: 'currencies', label: 'Currency', type: 'select', options: currencies },
        { key: 'isPrivate', label: 'Private/Public Asset', type: 'boolean' },
      ];
    });
  }

  protected onFilterChange(newFilters: Record<string, any>) {
    this.filters = { ...newFilters };

    this.securities$ = this._securityService
      .getSecurities(this.filters)
      .pipe(indicate(this.loadingSecurities$));
  }

  private getUniqueValues<T>(data: T[], key: keyof T): string[] {
    return Array.from(new Set(data.map(item => item[key]).filter(Boolean))) as string[];
  }
}