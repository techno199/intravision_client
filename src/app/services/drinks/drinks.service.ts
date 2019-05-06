import { Injectable, EventEmitter } from '@angular/core';
import { Drink } from 'src/app/models/drink/drink';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CoinsService } from '../coins/coins.service';
import { HttpClient, HttpParams,  HttpHeaders } from '@angular/common/http';
import { deviceId, apiDrinkCrud, apiBuyDrink } from '../api-routes';
import { AccountService } from '../account/account.service';

/** Contains all drinks-related operations */
@Injectable({
  providedIn: 'root'
})
export class DrinksService {
  constructor(
    private coinsService: CoinsService,
    private http: HttpClient
  ) {
      this.getDrinks()
        .subscribe((drinks: Drink[]) => {
          this.ownedDrinks = drinks;
          this.ownedDrinksChange.emit(this.ownedDrinks);
        })
    }
  /** Contains all device drinks info */
  ownedDrinks: Drink[];
  /** Emits each time new drink added or deleted */
  ownedDrinksChange = new EventEmitter<Drink[]>();
  /** Get all drink info */
  getDrinks(): Observable<any> {
    let options = {
      params: new HttpParams()
        .set('deviceId', deviceId)
    };
    return this.http.get(apiDrinkCrud, options)
  }
  /**
   *  Buy a drink
   *  @param drink drink to purchase
   */
  buyDrink = (drink: Drink): Observable<any> => {
    const options = {
      params: new HttpParams()
        .set('drinkId', drink.id.toString())
        .set('amount', '1')
    };

    if (drink.quantity > 0) {
      return this.http.get(apiBuyDrink, options)
        .pipe(
          tap(() => {
            drink.quantity -= 1;
            this.coinsService.userCash -= drink.price;
            this.coinsService.userCashChange.emit(
              this.coinsService.userCash
            )
          })
        );
    } else return throwError('');
  }
  /**
   * Update given grink
   * @param newDrink updated drink
   */
  updateDrink(newDrink: Drink): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    };

    return this.http.put(apiDrinkCrud, JSON.stringify(newDrink), options)
      .pipe(
        tap((drink: Drink) => {
          let i = this.ownedDrinks.findIndex(d => d.id === newDrink.id);
          this.ownedDrinks[i] = drink;
          this.ownedDrinksChange.emit(this.ownedDrinks);
        })
      );
  }
  /**
   * Delete a drink
   * @param drink drink to delete
   */
  deleteDrink(drink: Drink): Observable<any> {
    const options = {
      params: new HttpParams()
        .set('drinkId', drink.id.toString()),
      withCredentials: true
    };

    return this.http.delete(apiDrinkCrud, options)
      .pipe(
        tap(() => {
          let restDrinks = this.ownedDrinks.filter(d => d.id !== drink.id)
          this.ownedDrinks = restDrinks;
          this.ownedDrinksChange.emit(this.ownedDrinks);
        })
      );
  }
  /**
   * Add a new drink
   * @param drink new drink
   */
  addDrink(drink: Drink): Observable<any> {
    return this.http.post(apiDrinkCrud, drink, { withCredentials: true })
      .pipe(
        tap((drink: Drink) => {
          this.ownedDrinks.push(drink);
          this.ownedDrinksChange.emit(this.ownedDrinks);
        })
      );
  }
  
}
