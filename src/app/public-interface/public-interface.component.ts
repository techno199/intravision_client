import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Coin } from '../models/coin/coin';
import { CoinsService } from '../services/coins/coins.service';
import { DrinksService } from '../services/drinks/drinks.service';
import { Drink } from '../models/drink/drink';
import { AccountService } from '../services/account/account.service';
import { FormControl } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';
import { NotificationsService } from '../services/notifications/notifications.service';

/** Main form */
@Component({
  selector: 'app-public-interface',
  templateUrl: './public-interface.component.html',
  styleUrls: ['./public-interface.component.scss']
})
export class PublicInterfaceComponent implements OnInit {
  constructor(
    private coinsService: CoinsService,
    private drinksService: DrinksService,
    private accountService: AccountService,
    private notificationsService: NotificationsService
  ) { }
  /** Current user cash */
  cash: number = 0;
  /** All coins info */
  coins: Coin[] = [];
  /** All drinks info */
  drinks: Drink[] = [];
  /** Indicates if client is logged in */
  isAdmin = false;
  /** Displayed message*/
  message = '';
  /** admin code form control */
  code = new FormControl('');

  ngOnInit() {
    this.coins = this.coinsService.ownedCoins;
    this.drinks = this.drinksService.ownedDrinks;
    // Subscribe to services 
    this.notificationsService.messageChange
      .subscribe((message: string) => {
        this.message = message;
      });

    this.notificationsService.show('Загрузка', { isLoading: true, isPersistent: true });

    this.coinsService.userCashChange
      .subscribe(cash => {
        this.cash = cash;
      });

    this.coinsService.ownedCoinsChange
      .subscribe(coins => {
        this.coins = coins
        this.notificationsService.showMessage('Монеты загружены');
      });

    this.code.valueChanges
      .pipe(
        tap(() => {
          this.notificationsService.showMessage('Набор пароля...')
        })
      )
      .pipe(
        debounceTime(900)
      )
      .subscribe(code => {
        if (!code) return;

        this.notificationsService.show('Загрузка', { isLoading: true });


        this.accountService.auth(code)
          .subscribe(() => {
            this.notificationsService.showMessage('Вы вошли как админ', 10000)
          }, () => {
            this.notificationsService.showMessage('Ошибка авторизации');
          });
      });

    this.accountService.isAdminChange
      .subscribe(status => {
        this.isAdmin = status
      });
  }
  /** Return client cash */
  handleCheckout() {
    this.notificationsService.show('Выдача сдачи', { isLoading: true, isPersistent: true });
    this.coinsService.grabChange()
      .subscribe(() => {
        this.notificationsService.showMessage('Сдача выдана');
      }, () => {
        this.notificationsService.showMessage('Ошибка при выдаче сдачи');
      });
  }
  /** Log out */
  handleLogout() {
    this.accountService.logout()
      .subscribe(() => {
        this.code.setValue('');
        this.notificationsService.showMessage('logged out');
      });
  }
}
