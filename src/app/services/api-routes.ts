import { environment } from '../../environments/environment';
// Current dispencer id
export const deviceId = '1';
// Domain
let apiDomain = 'https://localhost:5001/api';
if(environment.production) {
  apiDomain = '/api';
} 
// Drinks
export const apiDrinkCrud = apiDomain + '/drinks';
export const apiBuyDrink = apiDomain + '/drinks/buydrink';
// Coins
export const apiCoinCrud = apiDomain + '/coins';
export const apiChangeCoinAmount = apiDomain + '/coins/changeamount';
export const apiGrabChange = apiDomain + '/coins/grabchange';
// Auth
export const apiLogin = apiDomain + '/account/login';
export const apiLogout = apiDomain + '/account/logout';
export const apiIsLoggedIn = apiDomain + '/account/isloggedin';

