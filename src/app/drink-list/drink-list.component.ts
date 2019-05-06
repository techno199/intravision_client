import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Drink } from '../models/drink/drink';
import { DrinksService } from '../services/drinks/drinks.service';
import { AccountService } from '../services/account/account.service';
import { isNumber } from 'util';
import { NotificationsService } from '../services/notifications/notifications.service';
import { CoinsService } from '../services/coins/coins.service';

/** Renders all the drinks and allows operations upon them */
@Component({
  selector: 'drink-list',
  templateUrl: './drink-list.component.html',
  styleUrls: ['./drink-list.component.scss']
})
export class DrinkListComponent implements OnInit {

  constructor(
    private drinksService: DrinksService,
    private accountService: AccountService,
    private notificationsService: NotificationsService,
    private coinsService: CoinsService
  ) { }
  /** All drinks info */
  drinks: Drink[];
  /** Indicates whether client is logged in */
  isAdmin: boolean;
  /** Contains info for new drink creation */
  newDrink = new Drink();
  /** Indicates whether purchaising gonna be triggered on drink click */
  private isBuyingAllowed_ = true;

  ngOnInit() {
    this.drinks = this.drinksService.ownedDrinks;
    this.isAdmin = this.accountService.isAdmin;

    this.accountService.isAdminChange
      .subscribe((status: boolean) => {
        this.isAdmin = status;
      });

    this.drinksService.ownedDrinksChange
      .subscribe((drinks: Drink[]) => {
        this.drinks = drinks;
      });
  }
  /**
   * @param drink clicked drink
   */
  handleDrinkClick = (drink: Drink) => {
    if (this.isAdmin || !this.isBuyingAllowed_) return;
    if (drink.price > this.coinsService.userCash) {
      this.notificationsService.showMessage('Не хватает средств');
      return;
    }
    // Block drink buttons while purchase is in process
    this.isBuyingAllowed_ = false;

    this.drinksService.buyDrink(drink)
      .subscribe(() => {
        this.notificationsService.showMessage(`Куплено: ${drink.name}`);
      }, () => {
        this.notificationsService.showMessage(`Ошибка покупки`);
      }, () => {
        this.isBuyingAllowed_ = true;
      });
  }
  /**
   * Update price for given drink
   * @param drink drink to update
   * @param e input change event
   */
  handlePriceChange(drink: Drink, e) {
    let parsedPrice = parseInt(e.target.value);
    if (  
      isNaN(parsedPrice) ||
      parsedPrice <= 0
    ) {
      this.notificationsService.showMessage('Число должно быть неотрицательным');
      return;
    }
    
    drink.price = parsedPrice;
    this.notificationsService.showMessage(`Изменение цены с ${drink.price} на ${parsedPrice}`, 0, true);

    this.drinksService.updateDrink(drink)
      .subscribe(() => {
        e.target.value = '';
        this.notificationsService.showMessage('Цена изменена')
      }, () => {
        this.notificationsService.showMessage('Ошибка при изменении цены напитка');
      });
  }
  /**
   * Update drink quantity
   * @param drink drink to update
   * @param e input change event
   */
  handleQuantityChange(drink: Drink, e) {
    let parsedQuantity = parseInt(e.target.value);
    if (
      isNaN(parsedQuantity) ||
      parsedQuantity < 0
    ) {
      this.notificationsService.showMessage('Число должно быть неотрицательным');
      return;
    }

    drink.quantity = parsedQuantity;
    this.notificationsService.showMessage('Изменение количества напитка', 0, true);

    this.drinksService.updateDrink(drink)
      .subscribe(() => {
        e.target.value = '';
        this.notificationsService.showMessage('Количество успешно изменено');
      });
  }

  handleDeleteClick(drink: Drink) {
    this.notificationsService.showMessage('Удаление..', 0, true);

    this.drinksService.deleteDrink(drink)
      .subscribe(() => {
        this.notificationsService.showMessage(`Удалено ${drink.name}`);
      }, () => {
        this.notificationsService.showMessage('Ошибка при удалении напитка');
      });
  }
  /** Creates a new drink */
  handleCreateClick() {
    let parsedPrice = parseInt(this.newDrink.price.toString());

    let parsedQuantity = parseInt(this.newDrink.quantity.toString());
    if (
      isNaN(parsedPrice) ||
      isNaN(parsedQuantity) ||
      parsedPrice <= 0 ||
      parsedQuantity < 0
    ) {
      this.notificationsService.showMessage('Ошибка в модели данных');
      return;
    }

    this.notificationsService.showMessage('Создание напитка..', 0, true);

    this.drinksService.addDrink(this.newDrink)
      .subscribe(() => {
        this.newDrink = new Drink();
        this.notificationsService.showMessage('Готово!');
      }, () => {
        this.notificationsService.showMessage('Ошибка при создании напитка');
      })
  }
}
