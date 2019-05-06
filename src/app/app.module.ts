import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PublicInterfaceComponent } from './public-interface/public-interface.component';
import { PaperComponent } from './paper/paper.component';
import { DrinkListComponent } from './drink-list/drink-list.component';
import { CoinListComponent } from './coin-list/coin-list.component';

@NgModule({
  declarations: [
    AppComponent,
    PublicInterfaceComponent,
    PaperComponent,
    DrinkListComponent,
    CoinListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
