import { Component, OnInit, Input } from '@angular/core';
import { Coin } from '../models/coin/coin';
import { CoinsService } from '../services/coins/coins.service';
import { AccountService } from '../services/account/account.service';
import { FormControl } from '@angular/forms';
import { NotificationsService } from '../services/notifications/notifications.service';

/** Renders all coins. Allows operations upon them */
@Component({
  selector: 'coin-list',
  templateUrl: './coin-list.component.html',
  styleUrls: ['./coin-list.component.scss']
})
export class CoinListComponent implements OnInit {
  constructor(
    private coinsService: CoinsService,
    private accountService: AccountService,
    private notificationService: NotificationsService
  ) { }
  /** All coins info */
  coins: Coin[];
  /** New coin value form control */
  newCoinValue = new FormControl('');
  /** New coin quantity form control */
  newCoinQuantity = new FormControl('');
  /** Indicates whether client is logged in */
  isAdmin: boolean;

  ngOnInit() {
    this.coins = this.coinsService.ownedCoins;
    this.isAdmin = this.accountService.isAdmin;

    this.accountService.isAdminChange
      .subscribe((status: boolean) => {
        this.isAdmin = status;
      });
    this.coinsService.ownedCoinsChange
      .subscribe((coins: Coin[]) => {
        this.coins = coins;
      });
  }
  /**
   * @param coin clicked coin
   */
  handleCoinClick(coin: Coin) {
    if (
      this.isAdmin ||
      coin.isBlocked
    ) return;

    this.notificationService.showMessage('Приём монеты..', 0, true);

    this.coinsService.changeAmount(coin, 1) 
      .subscribe(() => {
        this.coinsService.changeCash(coin.value);
        this.notificationService.showMessage(`Принято: ${coin.value}р`);
      });
  }
  /** Creates new coin */
  handleCreateCoinClick() {
    let newCoin = new Coin();
    newCoin.value = parseInt(this.newCoinValue.value);
    newCoin.quantity = parseInt(this.newCoinQuantity.value);

    if (
      isNaN(newCoin.value) ||
      isNaN(newCoin.quantity) ||
      newCoin.value <= 0 ||
      newCoin.quantity < 0
    ) {
      this.notificationService.showMessage('Ошибка в модели данных');
      return;
    }

    this.notificationService.showMessage('Создаем новую монетку..', 0, true);

    this.coinsService.createCoin(newCoin)
      .subscribe(() => {
        this.newCoinValue.setValue('');
        this.newCoinQuantity.setValue('');
        this.notificationService.showMessage('Новая монетка добавлена');
      }, () => {
        this.notificationService.showMessage('Ошибка создания монеты. Возможно, такой номинал уже существует');
      });
  }
  /**
   * Update coin value
   * @param coin target coin
   * @param e input change event
   */
  handleCoinValueChange(coin: Coin, e) {
    let parsedValue = parseInt(e.target.value);

    if (!parsedValue) 
      return;
    if (
      isNaN(parsedValue) ||
      parsedValue <= 0
    ) {
      this.notificationService.showMessage('Необходимо неотрецательное значение');
      return;
    }

    coin.value = parsedValue;
    this.notificationService.showMessage('Обновляю..', 0, true);

    this.coinsService.updateCoin(coin)
      .subscribe(() => {
        e.target.value = '';
        this.notificationService.showMessage('Готово!');
      });
  }
  /**
   * Update coin quantity
   * @param coin target coin
   * @param e input change event
   */
  handleCoinQuantityChange(coin: Coin, e) {
    if (!e.target.value) return;

    let parsedQuantity = parseInt(e.target.value);
    if (
      isNaN(parsedQuantity) ||
      parsedQuantity <= 0
    ) {
      this.notificationService.showMessage('Необходимо неотрецательное значение');
      return;
    }

    coin.quantity = parsedQuantity;
    this.notificationService.showMessage('Изменение количества монет..', 0, true);

    this.coinsService.updateCoin(coin)
      .subscribe(() => {
        e.target.value = '';
        this.notificationService.showMessage('Количество монет обновлено');
      });
  }
  /**
   * Update coin block status
   * @param coin target coin
   */
  handleBlockChange(coin: Coin) {
    this.notificationService.showMessage('Loading..', 0, true);

    this.coinsService.updateCoin(coin)
      .subscribe(() => {
        this.notificationService.showMessage('Done!');
      })
  }
  /**
   * Delete coin
   * @param coin target coin
   */
  handleDeleteClick(coin: Coin) {
    this.coinsService.deleteCoin(coin)
      .subscribe();
  }
}
