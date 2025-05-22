import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Security } from '../models/security';
import { SECURITIES } from '../mocks/securities-mocks';
import { SecuritiesFilter } from '../models/securities-filter';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  /**
   * Get Securities server request mock
   * */
  getSecurities(securityFilter?: SecuritiesFilter): Observable<Security[]> {
    const filteredSecurities = this._filterSecurities(securityFilter).slice(
      securityFilter?.skip ?? 0,
      securityFilter?.limit ?? 100
    );

    return of(filteredSecurities).pipe(delay(1000));
  }

  private _filterSecurities(
    securityFilter: SecuritiesFilter | undefined
  ): Security[] {
    if (!securityFilter) return SECURITIES;

    return SECURITIES.filter((s) => {
      const nameMatch =
        !securityFilter.name ||
        s.name.toLowerCase().includes(securityFilter.name.toLowerCase());

      const typeMatch =
        !Array.isArray(securityFilter.types) || securityFilter.types.length === 0 ||
        securityFilter.types.includes(s.type);

      const currencyMatch =
        !Array.isArray(securityFilter.currencies) || securityFilter.currencies.length === 0 ||
        securityFilter.currencies.includes(s.currency);

      const isPrivateMatch =
        securityFilter.isPrivate == null ||
        s.isPrivate === securityFilter.isPrivate;

      return nameMatch && typeMatch && currencyMatch && isPrivateMatch;
    });
  }
}
