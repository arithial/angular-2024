import { Injectable } from '@angular/core';
import {Book, GetMonthlyBookGQL} from '../../../graphql/generated';
import {firstValueFrom} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MonthlyService {

  constructor(private getMonthlyBookGQL: GetMonthlyBookGQL) { }

  getMonthlyBook()
  {
    var monthlyQuery = this.getMonthlyBookGQL.fetch().pipe(map(result => result.data.monthlyBook));
    return firstValueFrom(monthlyQuery) as Promise<Book>;
  }
}
