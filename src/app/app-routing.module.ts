import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublicInterfaceComponent } from './public-interface/public-interface.component';

const routes: Routes = [
  { path: '', component: PublicInterfaceComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
